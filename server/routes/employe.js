import express from "express";
import {  AddEmploye,DeleteEmploye,UpdateEmploye,Employe,getByIdEmploye} from "../controllers/employe.js";

const router = express.Router()

 
router.post("/add", AddEmploye)
router.delete("/:id", DeleteEmploye)
router.put("/:id", UpdateEmploye)
router.get("/", Employe)
router.get("/:id", getByIdEmploye)


export default router