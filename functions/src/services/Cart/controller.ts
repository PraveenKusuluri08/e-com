// import { User } from "./../Authentication/schema";
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
      return res
        .status(201)
        .json({ message: "Product added to the cart successfully." });
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});

router.use(endPoint).put("/decrementquantity", (req: any, res: any) => {
  const { productId } = req.body;
  const obj = new CartModel(req.user);
  obj
    ._decrement_quantity(productId)
    .then(() => {
      return res.status(200).json({ message: "Product quantity decremented" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: err });
    });
});

router
  .use(endPoint)
  .delete("/deleteproduct", (req: any, res: express.Response) => {
    const { productId } = req.query;
    const obj = new CartModel(req.user);
    obj
      ._delete_product_in_cart(productId)
      .then(() => {
        return res.status(200).json({ message: "Product deleted from cart😞" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ error: err });
      });
  });
export default router;
