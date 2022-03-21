import { db } from "../../config/admin";

export class AuthUtils {
  static async _check_user_exists(email: string) {
    let userRef = await db
      .collection("USERS")
      .where("email", "==", email)
      .where("isExists", "==", true)
      .get();

    let snap = await userRef;
    if (snap.size < 0) throw new Error("User not found");
    else return await snap.docs[0];
  }
}
