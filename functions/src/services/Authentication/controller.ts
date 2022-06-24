import { Model } from "./model";
import * as express from "express";
import { endPoint } from "../../helpers/endpoint";
import { isAdmin } from "../../middlewares/middlewares";
import { uploadProductImage } from "../../helpers/imageUpload";
import SendMails from "../../helpers/mail";
import ErrorHandlers from "../../helpers/errorHandlers";
import { body, check } from "express-validator";
const router = express.Router();

router.post(
  "/createUser",
  body("email").isEmail().normalizeEmail().withMessage("Please check email!!"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be more than 6 characters")
    .isLength({ max: 25 }),
  check(
    "conformPassword",
    "please check Password and Conform Password are not same"
  )
    .notEmpty()
    .withMessage("Conform password must not be empty")
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req: any, res: any) => {
    const obj = new Model(req.user);
    obj
      ._create_user(req.body, req)
      .then((message) => {
        return res.status(200).json({ message });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(404)
          .json({ error: ErrorHandlers.generateAuthCreateUserError(err) });
      });
  }
);

router.post("/uploadimage", endPoint, isAdmin, uploadProductImage);

router.post("/forgotpassword", (req: any, res: express.Response) => {
  const obj = new Model({});
  const { to, subject, body } = req.body;
  console.log(req.body);
  obj
    ._forgot_password(to, subject, body)
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

router.post(
  "/changePassword",
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be more than 6 characters")
    .isLength({ max: 25 }),
  check(
    "conformPassword",
    "please check Password and Conform Password are not same"
  )
    .notEmpty()
    .withMessage("Conform password must not be empty")
    .exists()
    .custom((value, { req }) => value === req.body.password),
  endPoint,
  (req: any, res: express.Response) => {
    const obj = new Model(req.user);
    //TODO:Add express validator for password length for correct password
    obj
      ._change_password(req.body, req)
      .then(() => {
        return res
          .status(200)
          .json({ message: "Password changed successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json({ error: err });
      });
  }
);

router
  .use(endPoint, isAdmin)
  .post("/createEmailTemplate", SendMails.createTemaplate);
export default router;
