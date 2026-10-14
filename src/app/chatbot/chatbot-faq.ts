export const PHONE = '+33 6 02 79 12 08'; // même numéro que PHONE_DISPLAY du composant

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[’‘`]/g, "'")
    .replace(/-/g, ' ');

/* ---------- Sécurité : toujours prioritaire ---------- */
const SAFETY =
  /(\bgaz\b|electrocut|court circuit|etincelle|disjoncteur|malaise|intoxic|tableau electrique|prise electrique|(eau|inond\w*).{0,40}electri|electri.{0,40}(eau|inond\w*))/;

const SAFETY_REPLY =
  `⚠️ Votre sécurité d'abord. Si vous sentez le gaz : n'allumez rien, ne touchez à aucun interrupteur, ouvrez les fenêtres, sortez du logement et appelez le 18 ou le 112.\n` +
  `S'il y a de l'eau près de l'électricité : ne touchez à rien, et appelez le 18 ou le 112 si quelqu'un est en danger.\n` +
  `Une fois en sécurité, appelez-nous au ${PHONE}.`;

/* ---------- Questions par sujet (la première qui correspond gagne) ---------- */
interface Rule {
  test: RegExp;
  reply: string;
}

const RULES: Rule[] = [
  {
    // Produits chimiques
    test: /(destop|deboucheur|produit chimique|acide|soude|javel|vinaigre|bicarbonate|ammoniaque)/,
    reply:
      `Nous déconseillons les déboucheurs chimiques, et surtout de mélanger des produits : cela peut dégager des gaz dangereux et abîmer les canalisations. ` +
      `Préférez la ventouse et l'eau chaude. Si le bouchon résiste, faites intervenir un professionnel : ${PHONE}.`,
  },
  {
    // Fosse septique
    test: /(fosse|septique|bac a graisse|micro station|pompage|vidange)/,
    reply:
      `Pour une fosse septique ou un bac à graisse (vidange, entretien, pompage), mieux vaut faire appel à un professionnel. ` +
      `Pour un devis, appelez-nous au ${PHONE} ou utilisez le formulaire de contact du site.`,
  },
  {
    // Odeurs
    test: /\b(odeurs?|sent mauvais|sent mal|puanteur|puant\w*|egouts?)\b/,
    reply:
      `Une mauvaise odeur vient souvent d'un siphon sec (peu utilisé) ou d'une canalisation encrassée. ` +
      `Versez un peu d'eau dans les siphons des douches, éviers ou sols peu utilisés, et aérez la pièce.\n` +
      `Si l'odeur persiste, le problème est peut-être plus profond (canalisation, fosse) : une inspection par caméra permet de le localiser. Appelez-nous au ${PHONE}.`,
  },
  {
    // WC
    test: /\b(wc|toilettes?|cuvette|chasse d'eau|chasse)\b/,
    reply:
      `Pour un WC bouché : ne tirez pas la chasse à répétition, pour éviter le débordement. ` +
      `Essayez une ventouse à WC avec des mouvements fermes, puis versez de l'eau chaude (pas bouillante). Évitez les déboucheurs chimiques.\n` +
      `Si l'eau ne descend toujours pas, ou si cela revient souvent, appelez-nous au ${PHONE}.`,
  },
  {
    // Évier, douche, lavabo...
    test: /\b(evier|lavabo|douche|baignoire|vasque|bonde|siphon|evacu\w*|ne s'ecoule|stagne|bouche\w*)\b/,
    reply:
      `Pour un évier, lavabo ou une douche qui s'évacue mal : retirez les cheveux et résidus visibles autour de la bonde, vérifiez le siphon (placez une bassine dessous) et essayez la ventouse. ` +
      `Un peu d'eau chaude peut aider à dissoudre les graisses. Évitez les produits chimiques et le démontage de pièces complexes.\n` +
      `Si ça ne passe pas, ou si l'eau remonte ailleurs, appelez-nous au ${PHONE}.`,
  },
  {
    // Hydrocurage
    test: /(hydrocur\w*|curage|haute pression|nettoyage (de )?canalisation)/,
    reply:
      `L'hydrocurage (ou curage) nettoie l'intérieur des canalisations avec de l'eau sous haute pression, pour éliminer dépôts, graisses et obstructions. ` +
      `Il sert pour les gros bouchons ou en entretien préventif. Pour savoir s'il convient à votre cas, appelez-nous au ${PHONE}.`,
  },
  {
    // Caméra / fuite
    test: /(camera|inspection|racines?|affaissement|casse|fissure|fuite)/,
    reply:
      `L'inspection par caméra permet de voir l'intérieur d'une canalisation pour repérer un bouchon, une racine, une casse ou une fuite sur le réseau d'évacuation, avant d'engager des travaux. ` +
      `Pour un rendez-vous ou un devis, appelez-nous au ${PHONE}.`,
  },
  {
    // Assainissement
    test: /(assainissement|conformite|mise aux normes|spanc|tout a l'egout|raccordement|collectif|individuel)/,
    reply:
      `Nous intervenons sur l'assainissement collectif et non collectif, y compris la mise en conformité. ` +
      `Pour étudier votre situation, appelez-nous au ${PHONE} ou remplissez le formulaire de contact du site.`,
  },
  {
    // Zone d'intervention
    test: /(zone|secteur|intervenez|intervenir|deplacez|deplacement|departement|code postal|pres de chez|ma ville|region|\b\d{5}\b)/,
    reply:
      `Je n'ai pas la liste précise de nos zones d'intervention. Pour savoir si nous pouvons venir chez vous, ` +
      `appelez-nous au ${PHONE} en indiquant votre ville ou votre code postal.`,
  },
  {
    // Horaires / délais
    test: /(horaire|ouvert|ferme|delai|rapidement|quand|week end|weekend|dimanche|samedi|nuit|disponible|rendez vous|rdv)/,
    reply:
      `Je ne peux pas vous annoncer d'horaires ni de délais précis. Le plus simple est de nous appeler au ${PHONE} : en cas d'urgence, nous vous répondons en priorité.`,
  },
];

/* ---------- Prix / devis ---------- */
const PRICE = /(devis|prix|tarifs?|combien|coute|cout|couter|gratuit|facture|budget)/;

const PRICE_REPLY =
  `Chaque intervention est différente : le tarif dépend du problème, de l'accès et du temps nécessaire, donc je ne peux pas vous donner de prix à distance. ` +
  `Pour un devis, appelez-nous au ${PHONE} ou remplissez le formulaire de contact du site. Dites-moi aussi de quel problème il s'agit, et je vous oriente.`;

const PRICE_NOTE = `Pour le prix, il dépend de l'intervention : demandez un devis au ${PHONE} ou via le formulaire de contact du site.`;

/* ---------- Politesse et réponse par défaut ---------- */
const GREETING = /^(bonjour|bonsoir|salut|coucou|hello|bjr)\b/;
const GREETING_REPLY =
  'Bonjour ! Je peux vous renseigner sur le débouchage, le curage, l’inspection caméra ou l’assainissement. Quel est votre problème ?';

const THANKS = /(\bmerci\b|^(parfait|super|ok|d'accord)\b)/;
const THANKS_REPLY = `Avec plaisir ! N'hésitez pas si vous avez une autre question. Pour un devis ou une intervention, appelez-nous au ${PHONE}.`;

const FALLBACK =
  `Je n'ai pas bien compris votre demande. Je peux vous renseigner sur le débouchage (WC, évier, douche), les mauvaises odeurs, ` +
  `l'hydrocurage, l'inspection caméra, les fosses septiques et l'assainissement. Vous pouvez aussi nous appeler au ${PHONE}.`;

/** Renvoie la réponse du chatbot pour le message du visiteur */
export function answer(raw: string): string {
  const t = normalize(raw);

  if (SAFETY.test(t)) return SAFETY_REPLY;

  const rule = RULES.find((r) => r.test.test(t));
  const price = PRICE.test(t);

  if (rule && price) return `${rule.reply}\n\n${PRICE_NOTE}`;
  if (rule) return rule.reply;
  if (price) return PRICE_REPLY;
  if (GREETING.test(t)) return GREETING_REPLY;
  if (THANKS.test(t)) return THANKS_REPLY;
  return FALLBACK;
}