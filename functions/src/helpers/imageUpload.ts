import { storage, db } from "../config/admin";
import * as Busboy from "busboy";
import * as express from "express";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

export const uploadProductImage = (req: any, res: express.Response) => {
  let fields: any;

  const busboy = Busboy({ headers: req.headers });

  let imageFileName: any;
  let imagesToUpload: any = [];
  let imageToAdd = {};
  let imageUrls: string[] = [];

  const { productInfo, productId } = req.query;
  //TODO:productInfo gives the product details for which product need to upload images

  busboy.on("field", (fieldname, fieldvalue) => {
    fields[fieldname] = fieldvalue;
  });

  busboy.on("file", (_fieldname: any, file: any, info: any) => {
    const { filename, mimeType } = info;
    if (
      mimeType !== "image/jpeg" &&
      mimeType !== "image/png" &&
      mimeType !== "jpg"
    ) {
      return res.status(404).json({
        message: "File type not accepted submit only 'png/jpeg/jpg'",
      });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 10000000
    )}.${productInfo}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToAdd = {
      imageFileName,
      filepath,
      mimeType,
    };

    file.pipe(fs.createWriteStream(filepath));
    //Add the image to the array
    return imagesToUpload.push(imageToAdd);
  });

  busboy.on("finish", async () => {

    imagesToUpload.forEach(
      async (image: {
        imageFileName: any;
        filepath: string;
        mimeType: any;
      }) => {
        imageUrls.push(
          `https://firebasestorage.googleapis.com/v0/b/e-com-91cdf.appspot.com/o/${image.imageFileName}?alt=media`
        );
        
          storage
            .bucket()
            .upload(image.filepath, {
              resumable: false,
              metadata: {
                metadata: {
                  contentType: image.mimeType,
                },
              },
            })
            .then(() => {
              return db
                .collection("PRODUCTS")
                .doc(productId)
                .update({
                  images:[{
                    ...imageUrls
                  }]
                })
                .then(() => {
                  return res.status(201).json({message:"Imaged uploaded successfully"})
                })
                .catch((err) => {
                  return res.status(400).json({ error: err });
                });
            })
      }
    );
  });
  busboy.end(req.rawBody);
};
