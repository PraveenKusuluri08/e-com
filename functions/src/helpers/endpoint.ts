import { admin, db } from "../config/admin";
import * as express from "express";

interface User extends express.RequestHandler{
  user:any;
  headers: any;
}

export function endPoint(req: any,
  res: express.Response,
  next: express.NextFunction) {
  if (!req.headers && !req.headers["authorization"]) {
    return res.status(404).json({ error: "UnAuthorised" });
  } else {
    const bearer: any = req.headers["authorization"];
    const token: any = bearer.split("Bearer ")[1];
    return admin
      .auth()
      .verifyIdToken(token)
      .then((decoded) => {

        console.log("decoded", decoded.uid);
        req.user= decoded.uid;
        return db
          .collection("USERS")
          .where("uid", "==", decoded.uid)
          .limit(1)
          .get();
      })
      .then((userData) => {
        console.log(userData);
        return next();
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/id-token-expired") {
          return res.status(401).json({
            message: `Token has expired please try again!!! with new Token`,
          });
        }
        return res.status(500).json({ message: `invalid token` });
      });
  }
}

