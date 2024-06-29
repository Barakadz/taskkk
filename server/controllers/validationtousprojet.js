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


 
export const GetTousProjetDG = (req, res) => {

  
   

  const q = "SELECT * FROM projet WHERE  validation_dg ='en cours' order by id desc";
  
  // Query the database
  db.query(q, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

  

export const GetProjetVal = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { dep } = req.body;
  
  // Check if mail is provided
  if (!dep) {
    return res.status(400).json({ message: "Departement is required" });
  }

  const q = "SELECT * FROM projet WHERE departement_user = ? and validation !='nonvalide' order by id desc";
  
  // Query the database
  db.query(q, [dep], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

export const UpdateProjetVal = (req, res) => {
  // Retrieve ID from parameters
  const id = req.params.id;

  // Check if ID is provided
  if (!id) {
      return res.status(400).json({ error: 'ID is required' });
  }

  // Validate body parameters
  const { validr, cause } = req.body;

  // Validate required body parameters
  if (!validr || !cause) {
      return res.status(400).json({ error: 'Validation status and cause are required' });
  }

  // Update the `tache` table if validation status is 'nonvalide'
       const qqaq = "UPDATE `tache` SET `validation_dg` = ? WHERE projet = ?";
      db.query(qqaq, [validr, id], (err) => {
          if (err) {
              console.error('Error executing query:', err);
              return res.status(500).json({ error: 'Database error' });
          }
      });
 
//update participant projet
const qq = "UPDATE `projet` SET `participant` = ?  WHERE id = ?";
db.query(qq, [req.body.participant, id], (err) => {
    if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
//update participant tache
const qqa = "UPDATE `tache` SET `equipe` = ?  WHERE projet = ?";
db.query(qqa, [req.body.participant, id], (err) => {
    if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});
  // Update the `projet` table
  const q = "UPDATE `projet` SET `validation_dg` = ?, `cause_directeur` = ? WHERE id = ?";
  db.query(q, [validr, cause, id], (err, userData) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (userData.affectedRows === 0) {
          return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json({ message: 'Project updated successfully' });
  });
};
