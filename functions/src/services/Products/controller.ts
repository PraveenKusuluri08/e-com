import { ProductModel } from "./model";
import * as express from "express";
import { endPoint, endPoint_user } from "../../helpers/endpoint";
import { isAdmin} from "../../middlewares/middlewares";

const router = express.Router();

router.post(
  "/admin/addProduct",
  endPoint,
  isAdmin,
  (req: any, res: express.Response) => {
    const obj = new ProductModel(req.user);

    obj
      ._create_product(req.body)
      .then(() => {
        return res
          .status(201)
          .json({ message: "New Product created successfully" });
      })
      .catch((err) => {
        return res.status(404).json({ error: "Failed to create product", err });
      });
  }
);

router.put(
  "/approveproducts",
  endPoint,
  isAdmin,
  (req: any, res: express.Response) => {
    const { productId } = req.query;
    const obj = new ProductModel(req.user);

    obj
      ._approve_products(productId)
      .then(() => {
        console.log("Product approved");
        return res.status(200).json({ message: "Product approved" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ error: err });
      });
  }
);
router.post("/reviewproducts", endPoint_user, (req: any, res: express.Response) => {
  const obj = new ProductModel(req.user);
  const { productId } = req.query;
  obj
    ._review_product(productId, req.body)
    .then(() => {
      return res.status(200).json({ message: "Product get reviewed" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: err });
    });
});

export default router;
