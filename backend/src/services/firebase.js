const admin = require("firebase-admin");

function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.credential.applicationDefault();
  }

  return null;
}

if (!admin.apps.length) {
  const cert = credential();
  admin.initializeApp(cert ? { credential: cert } : undefined);
}

module.exports = {
  admin,
  db: admin.firestore(),
  messaging: admin.messaging(),
};
