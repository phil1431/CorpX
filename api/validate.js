const dns = require('dns').promises;
const net = require('net');

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Gérer OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Invalid emails array' });
    }

    const results = [];
    
    // Limiter à 10 emails pour éviter timeout
    for (const email of emails.slice(0, 10)) {
      try {
        const result = await validateEmailComplete(email);
        results.push({
          email,
          ...result
        });
      } catch (error) {
        results.push({
          email,
          status: 'invalid',
          reason: 'Erreur validation',
          smtp: false,
          mx: false
        });
      }
    }

    return res.status(200).json({ results });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
}

async function validateEmailComplete(email) {
  // 1. Validation syntaxique
  if (!isValidEmailSyntax(email)) {
    return {
      status: 'invalid',
      reason: 'Format invalide',
      smtp: false,
      mx: false
    };
  }

  const domain = email.split('@')[1];

  // 2. Domaines jetables
  const disposableDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'tempmail.org', 'sharklasers.com', 'yopmail.com'
  ];
  
  if (disposableDomains.includes(domain)) {
    return {
      status: 'risky',
      reason: 'Email jetable',
      smtp: false,
      mx: false,
      disposable: true
    };
  }

  // 3. Vérification MX
  try {
    const mxRecords = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(new Error('MX timeout')), 3000))
    ]);
    
    if (!mxRecords || mxRecords.length === 0) {
      return {
        status: 'invalid',
        reason: 'Pas de serveur mail',
        smtp: false,
        mx: false
      };
    }

    // 4. Test SMTP simplifié
    const primaryMX = mxRecords[0].exchange;
    const smtpResult = await testSMTPSimple(email, primaryMX);
    
    return {
      status: smtpResult.valid ? 'valid' : 'invalid',
      reason: smtpResult.reason,
      smtp: smtpResult.valid,
      mx: true,
      mxServer: primaryMX,
      smtpCode: smtpResult.code
    };

  } catch (error) {
    return {
      status: 'invalid',
      reason: 'Domaine inexistant',
      smtp: false,
      mx: false
    };
  }
}

function testSMTPSimple(email, mxServer) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000; // 5 secondes max
    let response = '';

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      resolve({
        valid: false,
        reason: 'Timeout SMTP',
        code: 'TIMEOUT'
      });
    }, timeout);

    socket.connect(25, mxServer);

    socket.on('connect', () => {
      // Juste tester la connexion
      clearTimeout(timeoutId);
      cleanup();
      resolve({
        valid: true,
        reason: 'Serveur SMTP accessible',
        code: 'CONNECT'
      });
    });

    socket.on('error', () => {
      clearTimeout(timeoutId);
      cleanup();
      resolve({
        valid: false,
        reason: 'Serveur SMTP inaccessible',
        code: 'ERROR'
      });
    });
  });
}

function isValidEmailSyntax(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
