import express from "express";
import {  AddProjet,DeleteProjet,UpdateProjet,Projet,getByIdProjet,GetProjetMail} from "../controllers/projet.js";

const router = express.Router()

 
router.post("/add", AddProjet)
router.delete("/:id", DeleteProjet)
router.put("/:id", UpdateProjet)
router.get("/", Projet)
router.get("/:id", getByIdProjet)
router.post("/projetmail", GetProjetMail)


export default router