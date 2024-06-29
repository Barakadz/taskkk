import express from "express";
import {GetRh} from "../controllers/rh.js";

const router = express.Router()

 
 
router.get("/rh", GetRh)

 

export default router