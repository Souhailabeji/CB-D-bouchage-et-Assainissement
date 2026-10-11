import express from 'express';
import rateLimit from 'express-rate-limit';

const PORT = process.env.PORT || 3000;
const API_KEY = (process.env.GROQ_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const MODEL = process.env.CHAT_MODEL || 'openai/gpt-oss-20b';
const DEBUG = process.env.DEBUG === '1';
const PHONE = '+33 6 02 79 12 08';
const GROQ_URL = 'https://api.groq.com/openai/v1';

if (!API_KEY) {
  console.error('ERREUR : GROQ_API_KEY manquante dans CE terminal.');
  console.error('Tapez : $env:GROQ_API_KEY="votre_cle"  puis relancez.');
  process.exit(1);
}

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de "CB Débouchage & Assainissement", une entreprise de débouchage et d'assainissement.
Réponds toujours en français, de façon courte, claire et polie (3 à 5 phrases maximum).
Aide le client à décrire son problème (canalisation, WC, évier, douche, fosse septique, curage, inspection caméra, etc.) et donne des conseils simples et sans danger.
Ne donne jamais de prix précis : propose un devis gratuit et invite le client à appeler le ${PHONE}.
Ne mélange pas de produits chimiques et ne conseille pas de démontages dangereux.
Si le client décrit une odeur de gaz, un risque électrique, une inondation importante près d'installations électriques ou une personne en danger : dis d'abord de sécuriser les lieux, de ne pas toucher à l'électricité, et d'appeler les secours (18 ou 112) si nécessaire.
Si tu ne sais pas, invite le client à appeler le ${PHONE}.
Ne demande jamais d'informations sensibles (carte bancaire, mot de passe).`;

const FALLBACK = `Désolé, je rencontre un problème technique. Vous pouvez nous appeler au ${PHONE}.`;

function buildReply(text) {
  return { reply: text, response: text, message: text, text };
}

function failReply(debugText) {
  return buildReply(DEBUG ? `[DEBUG] ${debugText}` : FALLBACK);
}

const app = express();
app.use(express.json({ limit: '50kb' }));

app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans une minute.' },
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok', model: MODEL }));

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body || {};

    // Accepte { message } ou { messages: [...] } (+ { history } optionnel)
    let history = [];
    if (Array.isArray(body.messages)) {
      history = body.messages;
    } else if (typeof body.message === 'string') {
      history = [
        ...(Array.isArray(body.history) ? body.history : []),
        { role: 'user', content: body.message },
      ];
    }

    const messages = history
      .map((m) => ({
        role: m.role === 'assistant' || m.role === 'bot' || m.from === 'bot' ? 'assistant' : 'user',
        content: String(m.content ?? m.text ?? '').slice(0, 2000),
      }))
      .filter((m) => m.content.trim())
      .slice(-12);

    if (!messages.length) {
      return res.status(400).json({ error: 'Message manquant' });
    }

    const response = await fetch(`${GROQ_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.4,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Erreur Groq ${response.status} :`, errText);
      return res.json(failReply(`Groq ${response.status} : ${errText.slice(0, 300)}`));
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || FALLBACK;
    res.json(buildReply(reply));
  } catch (err) {
    console.error('Erreur serveur chat :', err.message, err.cause?.code ?? '');
    res.json(failReply(`Réseau : ${err.message} ${err.cause?.code ?? ''}`));
  }
});

// Test de la clé au démarrage (n'affiche jamais la clé)
async function checkGroq() {
  console.log(`Cle detectee : ${API_KEY.length} caracteres, debut "${API_KEY.slice(0, 4)}"`);
  try {
    const r = await fetch(`${GROQ_URL}/models`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      console.log('OK : Groq accepte la cle.');
    } else {
      console.error(`PROBLEME : Groq repond ${r.status} :`, (await r.text()).slice(0, 300));
    }
  } catch (e) {
    console.error('PROBLEME : impossible de joindre api.groq.com :', e.message, e.cause?.code ?? '');
  }
}

app.listen(PORT, () => {
  console.log(`Chat API (Groq, modele ${MODEL}) sur http://localhost:${PORT}${DEBUG ? ' [DEBUG ON]' : ''}`);
  checkGroq();
});
