const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  // Option 1: serviceAccountKey.json directly use karo (easiest!)
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
module.exports = { admin, auth };