import { Model } from "./model";
import * as express from "express";
import { endPoint } from "../../helpers/endpoint";
import { isAdmin } from "../../middlewares/middlewares";
import { uploadProductImage } from "../../helpers/imageUpload";
import SendMails from "../../helpers/mail";
const router = express.Router();

router.post("/createUser", (req: any, res: any) => {
  const obj = new Model(req.user);
  obj
    ._create_user(req.body)
    .then((message) => {
      return res.status(200).json({ message });
    })
    .catch((err) => {
      return res.status(404).json({ err });
    });
});

router.post("/uploadimage", endPoint, isAdmin, uploadProductImage);

router.post("/forgotpassword", (req: any, res: express.Response) => {
  const obj = new Model({});
  const {to,subject,body}= req.body
  console.log(req.body)
  obj
    ._forgot_password(to,subject,body)
    .then((info) => {
      return res
        .status(200)
        .json({ message: "Reset password Link has been sent" });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(400)
        .json({ error: "Failed to send reset password link" });
    });
});

router.post("/changePassword", endPoint, (req: any, res: express.Response) => {
  const obj = new Model(req.user);
  //TODO:Add express validator for password length for correct password
  obj
    ._change_password(req.body)
    .then(() => {
      return res.status(200).json({ message: "Password changed successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({ error: err });
    });
});

router.use(endPoint,isAdmin).post("/createEmailTemplate",SendMails.createTemaplate)
export default router;
