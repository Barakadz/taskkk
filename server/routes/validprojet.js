import express from "express";
import {  UpdateProjetVal,GetProjetVal } from "../controllers/validationprojet.js";

const router = express.Router()

 
 
 router.put("/:id", UpdateProjetVal)
 
router.post("/projetdep", GetProjetVal)


export default router