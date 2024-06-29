import express from "express";
import {  UpdateProjetVal } from "../controllers/validationtousprojet.js";

const router = express.Router()

 
 
 router.put("/:id", UpdateProjetVal)
 
 

export default router