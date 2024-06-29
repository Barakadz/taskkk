import express from "express";
import {  UpdateTacheVal,GetTacheVal } from "../controllers/validationtache.js";

const router = express.Router()

 
 
 router.put("/:id", UpdateTacheVal)
 
router.post("/projetdep", GetTacheVal)


export default router