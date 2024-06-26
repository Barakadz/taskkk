import express from "express";
import {    AddTache,DeleteTache,UpdateTache,Tache,getByIdTache,GetTacheMail} from "../controllers/tache.js";

const router = express.Router()

 
router.post("/add", AddTache)
router.delete("/:id", DeleteTache)
router.put("/:id", UpdateTache)
router.get("/", Tache)
router.get("/:id", getByIdTache)
router.post("/tachetmail", GetTacheMail)


export default router