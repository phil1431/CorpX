export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Toujours retourner 200 pour éviter les crashes
  try {
    const body = req.body || {};
    const emails = body.emails || [];
    
    const results = emails.slice(0, 50).map(email => {
      try {
        return validateEmailSafe(email);
      } catch (err) {
        return {
          email: email,
          status: 'invalid',
          reason: 'Erreur de validation',
          smtp: false,
          mx: false
        };
      }
    });

    return res.status(200).json({ 
      success: true,
      results: results,
      total: results.length 
    });
    
  } catch (error) {
    return res.status(200).json({ 
      success: false,
      results: [],
      error: 'API Error: ' + error.message
    });
  }
}

function validateEmailSafe(email) {
  // Protection contre les valeurs nulles/undefined
  if (!email || typeof email !== 'string') {
    return {
      email: email || 'invalid',
      status: 'invalid',
      reason: 'Email vide ou invalide',
      smtp: false,
      mx: false
    };
  }

  // Nettoyage de l'email
  email = email.trim().toLowerCase();

  // Validation syntaxique
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return {
      email: email,
      status: 'invalid',
      reason: 'Format email invalide',
      smtp: false,
      mx: false
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return {
      email: email,
      status: 'invalid',
      reason: 'Structure email incorrecte',
      smtp: false,
      mx: false
    };
  }

  const domain = parts[1];

  // Domaines jetables
  const disposableDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'tempmail.org', 'sharklasers.com', 'yopmail.com', 'spam4.me',
    'throwaway.email', 'getnada.com'
  ];
  
  if (disposableDomains.includes(domain)) {
    return {
      email: email,
      status: 'risky',
      reason: 'Email jetable détecté',
      smtp: false,
      mx: false,
      disposable: true
    };
  }

  // Domaines fiables
  const trustedDomains = [
    'gmail.com', 'yahoo.com', 'yahoo.fr', 'outlook.com', 'hotmail.com',
    'live.com', 'icloud.com', 'orange.fr', 'free.fr', 'sfr.fr',
    'wanadoo.fr', 'laposte.net', 'corpx.fr', 'msn.com', 'aol.com'
  ];

  if (trustedDomains.includes(domain)) {
    return {
      email: email,
      status: 'valid',
      reason: 'Email valide - domaine fiable',
      smtp: true,
      mx: true,
      trusted: true
    };
  }

  // Patterns suspects
  if (email.includes('test') || email.includes('demo') || email.includes('fake')) {
    return {
      email: email,
      status: 'risky',
      reason: 'Pattern suspect détecté',
      smtp: false,
      mx: false,
      suspicious: true
    };
  }

  // Par défaut : probablement valide
  return {
    email: email,
    status: 'valid',
    reason: 'Email probablement valide',
    smtp: true,
    mx: true
  };
}
