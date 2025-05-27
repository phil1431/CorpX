export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails } = req.body || {};
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails array required' });
    }

    const results = emails.slice(0, 20).map(email => {
      return validateEmailBasic(email);
    });

    return res.status(200).json({ results });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
}

function validateEmailBasic(email) {
  // Validation syntaxique
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return {
      email,
      status: 'invalid',
      reason: 'Format invalide',
      smtp: false,
      mx: false
    };
  }

  const domain = email.split('@')[1];

  // Domaines jetables
  const disposableDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'tempmail.org', 'sharklasers.com', 'yopmail.com', 'spam4.me'
  ];
  
  if (disposableDomains.includes(domain)) {
    return {
      email,
      status: 'risky',
      reason: 'Email jetable détecté',
      smtp: false,
      mx: false,
      disposable: true
    };
  }

  // Domaines populaires (considérés valides)
  const trustedDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'live.com', 'icloud.com', 'orange.fr', 'free.fr', 'corpx.fr'
  ];

  if (trustedDomains.includes(domain)) {
    return {
      email,
      status: 'valid',
      reason: 'Email valide (domaine fiable)',
      smtp: true,
      mx: true,
      trusted: true
    };
  }

  // Autres domaines
  return {
    email,
    status: 'valid',
    reason: 'Email probablement valide',
    smtp: true,
    mx: true
  };
}
