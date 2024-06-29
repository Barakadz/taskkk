import express from "express";
import { Directeur,  GetDirecteurDep} from "../controllers/dg.js";

const router = express.Router()

 
 
router.get("/", Directeur)

router.post("/directeurmail", GetDirecteurDep)


export default router