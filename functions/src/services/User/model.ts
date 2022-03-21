import { db } from "../../config/admin";
import { Address } from "./schema";

class User {
  actionperformer: any;
  constructor(user: any) {
    this.actionperformer = user;
  }
  async _add_deliveryAddress(address: Address) {
    const addressRef = db
      .collection(`USERS/${this.actionperformer}/ADDRESSES`)
      .doc();
    return addressRef
      .set(
        {
          ...address,
          docId: addressRef.id,
        },
        { merge: true }
      )
      .catch((err) => {
        throw err;
      });
  }
  async removeAddress(docId: string) {
    return db
      .collection(`USERS/${this.actionperformer}/ADDRESSES`)
      .doc(docId)
      .delete()
      .catch((err) => {
        throw err;
      });
  }
}

export default User;
