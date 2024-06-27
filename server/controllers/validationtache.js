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


  

  

export const GetTachVal = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { dep } = req.body;
  
  // Check if mail is provided
  if (!dep) {
    return res.status(400).json({ message: "Departement is required" });
  }

  const q = "SELECT * FROM tache WHERE departement_user = ? and validatio = ? order by id desc";
  
  // Query the database
  db.query(q, [dep,'valide'], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

 
export const UpdateProjetVal = (req, res) => {
    //recupére vers paramétres
    const id = req.params.id;
    //recupére vers body
   

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

  //select titre de projet 
    const qq = "SELECT titre_projet FROM projet WHERE id = ?";

   db.query(qq, [id], (err, userData) => {
     if (err) {
       return res.status(500).json({ message: "Erreur de base de données", error: err });
     }
   
     if (userData.length > 0) {
       const tit = userData[0].titre_projet;

    

     if(req.body.validr=='nonvalide'){
      const qq = "UPDATE `tache` SET `validation` = ?,`cause_responsable` = ?  WHERE projet = ?";
  
      db.query(qq,[ req.body.validr,req.body.cause,
          
        tit], (err, userData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Database error' });
        }
    
     })
    }

 }  });

 
    
    const q = "UPDATE `projet` SET `validation` = ?,`cause_responsable` = ?  WHERE id = ?";
  
    db.query(q,[ req.body.validr,req.body.cause,
        
   id], (err, userData) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userData.affectedRows === 0) {
        return res.status(404).json({ error: 'projet not found' });
      }
  
      return res.status(200).json({ message: 'projet updated successfully' });
    });

}

 