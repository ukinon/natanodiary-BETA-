var admin = require("firebase-admin");

var serviceAccount = require("./natano-diary.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://natano-diary-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}
