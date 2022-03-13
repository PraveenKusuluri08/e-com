import * as express from "express";
import { CartModel } from "./model";
import { endPoint } from "../../helpers/endpoint";
const router = express.Router();

router.use(endPoint).post("/addtocart", (req: any, res: any) => {
  const obj = new CartModel(req.user);

  const prodData = req.body;
  obj
    ._add_to_cart(prodData)
    .then((msg) => {
      return res.status(201).json({ message: "Product added to the cart successfully."});
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});

export default router;
