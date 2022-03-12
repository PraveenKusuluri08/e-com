import * as admin from "firebase-admin";
import * as serviceAccount from "./admin.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://e-com-91cdf-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const storage = admin.storage();


export { db, admin, storage };
