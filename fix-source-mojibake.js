/**
 * fix-source-mojibake.js
 *
 * Corrige le texte mal encode (mojibake, ex: "Ã©" au lieu de "é",
 * "â€“" au lieu de "–") directement dans les fichiers source (.html, .ts)
 * du dossier src/.
 *
 * Le texte a ete corrompu en reinterpretant des octets UTF-8 comme du
 * Windows-1252. Ce script inverse precisement cette operation, caractere
 * par caractere, uniquement sur les portions de texte suspectes — le
 * reste du fichier n'est jamais touche.
 *
 * ------------------------------------------------------------
 * UTILISATION
 * ------------------------------------------------------------
 * 1) Mode APERCU (ne modifie RIEN, affiche juste ce qui serait change) :
 *      node fix-source-mojibake.js
 *
 * 2) Mode APPLICATION (reecrit reellement les fichiers) :
 *      node fix-source-mojibake.js --apply
 * ------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const ROOT = path.join(__dirname, "src");
const EXTENSIONS = [".html", ".ts"];

// ---- Table de correspondance Windows-1252 (octets 0x80-0x9F) ----
const WIN1252_SPECIALS = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

function charToWin1252Byte(ch) {
  const code = ch.codePointAt(0);
  if (code <= 0xff) return code;
  if (WIN1252_SPECIALS[code] !== undefined) return WIN1252_SPECIALS[code];
  return null;
}

// Une "run" de mojibake fait au moins 2 caracteres consecutifs pris dans
// l'ensemble des caracteres Windows-1252 etendus (0x80-0xFF + symboles
// typographiques speciaux)
const RUN_RE =
  /[\u0080-\u00FF\u2018\u2019\u201C\u201D\u2013\u2014\u2026\u2020\u2021\u2022\u2039\u203A\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2030\u20AC\u2122]{2,}/g;

function fixMojibakeText(text) {
  return text.replace(RUN_RE, (run) => {
    const bytes = [];
    for (const ch of run) {
      const b = charToWin1252Byte(ch);
      if (b === null) return run; // caractere non mappable, on laisse tel quel
      bytes.push(b);
    }
    try {
      const fixed = Buffer.from(bytes).toString("utf8");
      if (!fixed.includes("\uFFFD")) return fixed; // conversion valide
    } catch (e) {
      // ignore
    }
    return run; // conversion invalide, on ne touche pas
  });
}

// ---- Parcours recursif des fichiers ----
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(fullPath, files);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

// ---- Script principal ----
function main() {
  console.log(
    APPLY
      ? "MODE APPLICATION - les fichiers vont etre modifies."
      : "MODE APERCU - aucune modification ne sera ecrite."
  );
  console.log("----------------------------------------------------");

  const files = walk(ROOT);
  let totalFilesChanged = 0;
  let totalLinesChanged = 0;

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, "utf8");
    const fixed = fixMojibakeText(original);

    if (fixed !== original) {
      totalFilesChanged++;
      const relPath = path.relative(__dirname, filePath);
      console.log(`\nFichier : ${relPath}`);

      const originalLines = original.split("\n");
      const fixedLines = fixed.split("\n");
      for (let i = 0; i < originalLines.length; i++) {
        if (originalLines[i] !== fixedLines[i]) {
          totalLinesChanged++;
          console.log(`  avant : ${originalLines[i].trim()}`);
          console.log(`  apres : ${fixedLines[i].trim()}`);
        }
      }

      if (APPLY) {
        fs.writeFileSync(filePath, fixed, "utf8");
        console.log(`  -> Fichier mis a jour.`);
      }
    }
  }

  console.log("\n----------------------------------------------------");
  console.log(
    `Total : ${totalFilesChanged} fichier(s), ${totalLinesChanged} ligne(s) concernee(s).`
  );
  if (!APPLY) {
    console.log("Ceci etait un APERCU. Relance avec --apply pour ecrire les corrections.");
  } else {
    console.log("Les fichiers ont ete corriges.");
  }
}

main();