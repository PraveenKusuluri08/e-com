import { db, admin } from "../../config/admin";
import SendMails from "../../helpers/mail";
import { User } from "./schema";
import { AuthUtils } from "./utils";

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
                  role: 0,
                },
                { merge: true }
              );
          })
          .then(() => {
            resolve("User created successfully");
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }
    );
  }

  async _forgot_password(email: string,subject:string,body:string) {
    AuthUtils._check_user_exists(email).then((data: any) => {
      console.log("data",data);
      const obj = new SendMails()
      return admin
        .auth()
        .generatePasswordResetLink(email)
        .then((link) => {
          console.log(link)
          //TODO:Handling the link here
         return obj.mailToForgotPassword(email,subject,body,link)
        }).then((info)=>{
          console.log("object",info)
          return info
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  async _change_password(password: string) {
    return admin
      .auth()
      .updateUser(this.actionperformer, {
        password: password,
      })
      .then(() => {
        const batch = db.batch();
        let logRef = db
          .collection("USERS")
          .doc(this.actionperformer)
          .collection("LOGS")
          .doc();

        batch.update(logRef, {
          message: "User changed password",
          changedAt: new Date().toISOString(),
        });
        batch.commit();
      })
      .catch((err) => {
        throw err;
      });
  }
}
