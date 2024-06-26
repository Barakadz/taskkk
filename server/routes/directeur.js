import express from "express";
import {   Directeur} from "../controllers/directeur.js";

const router = express.Router()

 
 
router.get("/", Directeur)
 


export default router