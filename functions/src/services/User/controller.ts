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

router.delete("/address", endPoint, (req: any, res: express.Response) => {
  const obj = new User(req.user);
  const { addressId } = req.query;
  obj
    .removeAddress(addressId)
    .then(() => {
      return res
        .status(200)
        .json({
          message:
            "Address you are selected is deleted.Please select a new address for delivery",
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(404)
        .json({ error: "Some thing went wrong please try again" });
    });
});

export default router;
