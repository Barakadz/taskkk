import express from "express";
import {  GetTousPrimes,AddPrime ,mailPrime,GetAllPrimes} from "../controllers/prime.js";

const router = express.Router()

 
 
 
router.get("/primgshahasnaoui", GetTousPrimes)

router.post("/add", AddPrime)
router.post("/mailprime", mailPrime)
router.get("/getAllPrimegsh", GetAllPrimes)

export default router