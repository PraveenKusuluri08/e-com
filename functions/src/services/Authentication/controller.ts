import {Model} from "./model"
import * as express from "express"

const router =express.Router()

router.post("/createUser",(req:any,res:any)=>{
    const obj = new Model(req.user);
    obj._create_user(req.body).then((message)=>{
        return res.status(200).json({message});
    }).catch(err=>{
        return res.status(404).json({err})
    }) 
})


export default router