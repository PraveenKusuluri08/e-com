import * as functions from "firebase-functions";
import * as express from "express"
import Auth from "./services/Authentication/controller"
import * as cors from "cors"
const app= express()


app.use(express.json())
app.use(cors({origin:true}))

app.use("/auth",Auth)
exports.app= functions.https.onRequest(app)