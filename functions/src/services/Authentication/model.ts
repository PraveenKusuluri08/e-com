import { db, admin, storage } from "../../config/admin";
import { User } from "./schema";

export class Model {
  actionperformer: any;
  constructor(user: object) {
    this.actionperformer = user;
  }

  async _create_user(inputs: User) {
    let userInfo: any = {};
    return new Promise(
      (resolve: (name: string) => any, reject: (err: string) => any) => {
        return admin
          .auth()
          .createUser({ email: inputs.email, password: inputs.password })
          .then((user) => {
            userInfo = user;
            admin.auth().setCustomUserClaims(user.uid, { email: inputs.email });
          })
          .then(() => {
            console.log(userInfo.uid);
            return db
              .collection("USERS")
              .doc(userInfo.uid)
              .set(
                {
                  ...inputs,
                  uid: userInfo.uid,
                  createdAt: new Date().toISOString(),
                  profilePic:
                    "https://firebasestorage.googleapis.com/v0/b/e-com-91cdf.appspot.com/o/121.jpg?alt=media",
                },
                { merge: true }
              );
          })
          .then(() => {
            resolve("User created successfully");
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    );
  }
}
