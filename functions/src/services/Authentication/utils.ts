import { db } from "../../config/admin";

export class AuthUtils {
  static async _check_user_exists(email: string) {
    return db
      .collection("USERS")
      .where("email", "==", email)
      .where("isExists", "==", true)
      .get()
      .then((snap) => {
        if (snap.size < 0) throw new Error("Document not exists");
        else return snap.docs[0];
      });
  }
}
