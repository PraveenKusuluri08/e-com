import * as express from "express";
import { endPoint } from "../../helpers/endpoint";
import User from "./model";
// import { body, validationResult } from 'express-validator';
const router = express.Router();

router.post("/address", endPoint, (req: any, res: express.Response) => {
  const obj = new User(req.user);

  obj
    ._add_deliveryAddress(req.body)
    .then(() => {
      return res.status(200).json({ message: "New Address added" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

export default router;
