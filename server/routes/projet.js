import express from "express";
import {  AddProjet,DeleteProjet,Getdateprojet,UpdateProjet,GetParticipantProjet,Projet,getByIdProjet,GetProjetMail,GetIdProjet} from "../controllers/projet.js";

const router = express.Router()

 
router.post("/add", AddProjet)
router.delete("/:id", DeleteProjet)
router.put("/:id", UpdateProjet)
router.get("/", Projet)
router.get("/:id", getByIdProjet)
router.post("/projetmail", GetProjetMail)
router.post("/projetpar", GetParticipantProjet)

router.post("/projetdate", Getdateprojet)
router.post("/projettitre", GetIdProjet)

export default router