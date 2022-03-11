import { ProductModel } from "./model";
import * as express from "express";
import { endPoint } from "../../helpers/endpoint";
import { isAdmin } from "../../middlewares/middlewares";

const router = express.Router();

router.post("/admin/addProduct",endPoint,isAdmin, (req: any, res: express.Response) => {
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
  });

export default router;
