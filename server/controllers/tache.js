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


 
export const AddTache = (req, res) => {
  //CHECK USER IF EXISTS

 // const q = "SELECT * FROM users WHERE email = ?";

 // db.query(q, [req.body.EmailAdress], (err, data) => {
   // if (err) return res.status(500).json(err);
    //if (data.length) return res.status(409).json("User already exists!");
    //CREATE A NEW USER
    //Hash the password
   // const salt = bcrypt.genSaltSync(10);//method of hash
   // const hashedPassword = bcrypt.hashSync(req.body.Password, salt);
     const currentDate = moment();
    const Date=currentDate.format('DD/MM/YYYY  HH:mm:ss');
  
    const q =
      "INSERT INTO `tache`( `titre_tache`,`level`,  `description`, `equipe`, `date_debut`, `date_fin`, `etat`, `mail`, `validation`, `date`)   VALUE (?)";

    const values = [
      req.body.titre_tache,
      req.body.level,

      req.body.description,
      req.body.equipe,
      req.body.date_debut,
      req.body.date_fin,
      req.body.etat,
      req.body.mail,
      'en cours',
Date

     ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Tache  has been created.");
    });
 // });
};



export const GetTacheMail = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { mail } = req.body;
  
  // Check if mail is provided
  if (!mail) {
    return res.status(400).json({ message: "Mail is required" });
  }

  const q = "SELECT * FROM tache WHERE mail = ? order by id desc";
  
  // Query the database
  db.query(q, [mail], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}
export const DeleteTache = (req, res) => {

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
  
  



//remove from bdd
    const q = "DELETE FROM `tache`  WHERE id = ?";
  
    db.query(q, [id], (err, userData) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userData.affectedRows === 0) {
        return res.status(404).json({ error: 'Tache not found' });
      }
  
      return res.status(200).json({ message: 'Tache deleted successfully' });
    });
}
export const Tache = (req, res) => {

  


  const q = "SELECT * FROM tache  order by id desc ";

  db.query(q, (err, userData) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de base de données", error: err });
    }
  
    if (userData.length > 0) {
      return res.status(200).json(userData);
    } else {
      return res.status(404).json({ message: 'Tache  not found' });
    }
  });


}


export const getByIdTache = (req, res) => {

  
const id=req.params.id

  const q = "SELECT * FROM tache where id = ? ";

  db.query(q,[id], (err, userData) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de base de données", error: err });
    }
  
    if (userData.length > 0) {
      return res.status(200).json(userData);
    } else {
      return res.status(404).json({ message: 'Tache  not found' });
    }
  });


}
export const UpdateTache = (req, res) => {
    //recupére vers paramétres
    const id = req.params.id;
    //recupére vers body
   

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

  
  
    
    
    const q = "UPDATE `tache` SET `titre_tache` = ?,   `level` = ? , `description` = ? , `equipe` = ? , `date_debut` = ? , `date_fin` = ? , `etat` = ? , `file` = ?     WHERE id = ?";
  
    db.query(q,[req.body.titre_tache,req.body.level,req.body.description,req.body.equipe,req.body.date_debut,req.body.date_fin,req.body.etat,req.body.file,,id], (err, userData) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userData.affectedRows === 0) {
        return res.status(404).json({ error: 'Tache not found' });
      }
  
      return res.status(200).json({ message: 'Tache updated successfully' });
    });

}

 