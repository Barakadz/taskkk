import express from "express";
import {  UpdateProjetVal,GetProjetVal,GetTousProjetDG } from "../controllers/validationprojet.js";

const router = express.Router()

 
 
 router.put("/:id", UpdateProjetVal)
 
router.post("/projetdep", GetProjetVal)
router.get("/", GetTousProjetDG)


export default router