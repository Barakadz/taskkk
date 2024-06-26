import express from "express";
import {    AddEvaluation} from "../controllers/evaluation.js";

const router = express.Router()

 
router.post("/add", AddEvaluation)
 


export default router