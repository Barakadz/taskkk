import express from "express";
import {    AddContact} from "../controllers/contact.js";

const router = express.Router()

 
router.post("/add", AddContact)
 


export default router