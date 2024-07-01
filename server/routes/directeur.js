import express from "express";
import { Directeur,  GetDirecteurDep,GetDirecteurDepByMLail} from "../controllers/directeur.js";

const router = express.Router()

 
 
router.get("/", Directeur)

router.post("/directeurmail", GetDirecteurDep)
 

router.post("/directeurdepartement", GetDirecteurDepByMLail)


export default router