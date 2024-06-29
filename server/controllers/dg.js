import { db } from "../connect.js";
//import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import moment from "moment/moment.js";
import qr  from "qrcode";
import fs from "fs";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

// Now you can access process.env.JWT_SECRET


 
export const Directeur = (req, res) => {

  


  const q = "SELECT mail FROM dg  order by id desc ";

  db.query(q, (err, userData) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de base de données", error: err });
    }
  
    if (userData.length > 0) {
      return res.status(200).json(userData);
    } else {
      return res.status(404).json({ message: 'directeur  not found' });
    }
  });


}


export const GetDirecteurDep = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { dep } = req.body;
  
  // Check if mail is provided
  if (!dep) {
    return res.status(400).json({ message: "departement is required" });
  }

  const q = "SELECT mail	 FROM dg WHERE departement = ?  ";
  
  // Query the database
  db.query(q, [dep], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

 