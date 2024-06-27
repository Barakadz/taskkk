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


 
export const AddProjet = (req, res) => {
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
      "INSERT INTO `projet`( `titre_projet`, `description`, `chef_projet`, `date_debut`, `date_fin`, `departement`, `filiale`, `participant`, `tache`, `mail`, `departement_user`, `validation`, `validation_dg`, `date`, `cause_responsable`, `cause_directeur`)   VALUE (?)";
     const values = [
      req.body.titre_projet,
       req.body.description,
      req.body.chefprojetgroupe,
      req.body.date_debut,
      req.body.date_fin,
      req.body.departement,
      req.body.filialegroupe,
      req.body.participant,
      '0',

      req.body.mail,
      req.body.departement_user,
'en cours',

'en cours',
Date,
'en cours',

'en cours',

     ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Projet  has been created.");
    });
 // });
};



export const DeleteProjet = (req, res) => {

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
  
  



//remove from bdd
    const q = "DELETE FROM `projet`  WHERE id = ?";
  
    db.query(q, [id], (err, userData) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userData.affectedRows === 0) {
        return res.status(404).json({ error: 'Projet not found' });
      }
  
      return res.status(200).json({ message: 'Projet deleted successfully' });
    });
}
export const Projet = (req, res) => {

  


  const q = "SELECT * FROM projet  order by id desc ";

  db.query(q, (err, userData) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de base de données", error: err });
    }
  
    if (userData.length > 0) {
      return res.status(200).json(userData);
    } else {
      return res.status(404).json({ message: 'Projet  not found' });
    }
  });


}

export const GetProjetMail = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { mail } = req.body;
  
  // Check if mail is provided
  if (!mail) {
    return res.status(400).json({ message: "Mail is required" });
  }

  const q = "SELECT * FROM projet WHERE mail = ? order by id desc";
  
  // Query the database
  db.query(q, [mail], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}


export const getByIdProjet = (req, res) => {

  
const id=req.params.id

  const q = "SELECT * FROM projet where id = ? ";

  db.query(q,[id], (err, userData) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de base de données", error: err });
    }
  
    if (userData.length > 0) {
      return res.status(200).json(userData);
    } else {
      return res.status(404).json({ message: 'Projet  not found' });
    }
  });


}
export const UpdateProjet = (req, res) => {
    //recupére vers paramétres
    const id = req.params.id;
    //recupére vers body
   

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

  
     
    
    const q = "UPDATE `projet` SET `titre_projet` = ?,   `description` = ? , `chef_projet` = ? , `date_debut` = ? , `date_fin` = ? ,`departement` = ? , `filiale` = ? , `participant` = ?   WHERE id = ?";
  
    db.query(q,[req.body.titre_projet,req.body.description,req.body.chef_projet,req.body.date_debut,req.body.date_fin
      ,req.body.departement,req.body.filiale,req.body.participant ,
        
   id], (err, userData) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userData.affectedRows === 0) {
        return res.status(404).json({ error: 'Galerie not found' });
      }
  
      return res.status(200).json({ message: 'Galerie updated successfully' });
    });

}

 