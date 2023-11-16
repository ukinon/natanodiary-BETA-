import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require("./natano-diary-v2-service-key.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://natano-diary-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const getUser = (req, res) => {
  console.log(req.params.id);
  getAuth()
    .getUser(req.params.id)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(userRecord.toJSON());
    })
    .catch((error) => {
      console.log("Error fetching user data:", error.message);
    });
};

export { getUser as POST };
