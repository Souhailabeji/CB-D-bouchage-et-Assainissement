/**
 * fix-firestore-encoding.js
 *
 * Corrige les chaînes de texte mal encodées (mojibake) dans TOUTES les
 * collections et documents de Firestore.
 *
 * Cause typique : du texte UTF-8 ("é") a été enregistré comme s'il était
 * en Latin-1/Windows-1252, ce qui donne "Ã©" au lieu de "é".
 *
 * ------------------------------------------------------------
 * UTILISATION
 * ------------------------------------------------------------
 * 1) Mode APERÇU (ne modifie RIEN, affiche juste ce qui serait changé) :
 *      node fix-firestore-encoding.js
 *
 * 2) Mode APPLICATION (écrit réellement les corrections dans Firestore) :
 *      node fix-firestore-encoding.js --apply
 * ------------------------------------------------------------
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const path = require("path");

// ---- Configuration ----
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const APPLY = process.argv.includes("--apply");

// ---- Initialisation Firebase Admin ----
const serviceAccount = require(SERVICE_ACCOUNT_PATH);
const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(firebaseApp);

// ---- Détection et correction du mojibake ----
function looksMojibake(str) {
  // Motifs typiques d'un texte UTF-8 mal réinterprété en Latin-1/Windows-1252
  return /Ã[\x80-\xBF]|â€[\x99\x9c\x9d\x93\x94\xa6]|Â[\x80-\xBF]/.test(str);
}

function fixMojibake(str) {
  if (typeof str !== "string" || !looksMojibake(str)) return str;
  try {
    const fixed = Buffer.from(str, "latin1").toString("utf8");
    // On n'accepte la correction que si elle ne produit pas de caractère
    // de remplacement invalide et qu'elle ne "ressemble" plus à du mojibake
    if (!fixed.includes("\uFFFD") && !looksMojibake(fixed)) {
      return fixed;
    }
  } catch (e) {
    // ignore, on garde la chaîne d'origine
  }
  return str;
}

// ---- Parcours récursif d'un objet/document ----
function fixValue(value, changes, pathTrail) {
  if (typeof value === "string") {
    const fixed = fixMojibake(value);
    if (fixed !== value) {
      changes.push({ path: pathTrail.join("."), before: value, after: fixed });
      return fixed;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v, i) => fixValue(v, changes, [...pathTrail, i]));
  }
  if (value && typeof value === "object" && !(value instanceof Timestamp)) {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = fixValue(value[key], changes, [...pathTrail, key]);
    }
    return result;
  }
  return value;
}

// ---- Script principal ----
async function main() {
  console.log(APPLY ? "MODE APPLICATION — les documents vont être modifiés." : "MODE APERÇU — aucune modification ne sera écrite.");
  console.log("----------------------------------------------------");

  const collections = await db.listCollections();
  let totalDocsChanged = 0;
  let totalFieldsChanged = 0;

  for (const collectionRef of collections) {
    console.log(`\nCollection : ${collectionRef.id}`);
    const snapshot = await collectionRef.get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const changes = [];
      const fixedData = fixValue(data, changes, []);

      if (changes.length > 0) {
        totalDocsChanged++;
        totalFieldsChanged += changes.length;
        console.log(`  Document ${doc.id} — ${changes.length} champ(s) à corriger :`);
        for (const c of changes) {
          console.log(`    [${c.path}]`);
          console.log(`      avant : ${c.before}`);
          console.log(`      après : ${c.after}`);
        }

        if (APPLY) {
          await doc.ref.set(fixedData, { merge: false });
          console.log(`    -> Document ${doc.id} mis à jour.`);
        }
      }
    }
  }

  console.log("\n----------------------------------------------------");
  console.log(`Total : ${totalDocsChanged} document(s), ${totalFieldsChanged} champ(s) concerné(s).`);
  if (!APPLY) {
    console.log("Ceci était un APERÇU. Relance avec --apply pour écrire les corrections dans Firestore.");
  } else {
    console.log("Les corrections ont été appliquées dans Firestore.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erreur :", err);
    process.exit(1);
  });