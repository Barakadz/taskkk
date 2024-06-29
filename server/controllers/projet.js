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

 //CHECK USER IF EXISTS

 // const q = "SELECT * FROM users WHERE email = ?";

 // db.query(q, [req.body.EmailAdress], (err, data) => {
   // if (err) return res.status(500).json(err);
    //if (data.length) return res.status(409).json("User already exists!");
    //CREATE A NEW USER
    //Hash the password
   // const salt = bcrypt.genSaltSync(10);//method of hash
   // const hashedPassword = bcrypt.hashSync(req.body.Password, salt);
     
 
   export const AddProjet = (req, res) => {
    const checkTitleQuery = "SELECT * FROM projet WHERE titre_projet = ?";
    
    db.query(checkTitleQuery, [req.body.titre_projet], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Le projet existe déjà !");
  
      const checkEmailQuery = "SELECT COUNT(id) AS projectCount FROM projet WHERE mail = ?";
      db.query(checkEmailQuery, [req.body.mail], (err, data) => {
        if (err) return res.status(500).json(err);
  
        const projectCount = data[0].projectCount;
        if (projectCount === 5) return res.status(400).json("le nombre maximum des projet de chaque utilisateur est 5");
  
        const currentDate = moment();
        const formattedDate = currentDate.format('DD/MM/YYYY HH:mm:ss');
        
        const insertQuery =
          "INSERT INTO `projet`(`titre_projet`, `description`, `chef_projet`, `date_debut`, `date_fin`, `departement`, `filiale`, `participant`, `tache`, `mail`, `departement_user`, `validation`, `validation_dg`, `date`, `cause_responsable`, `cause_directeur`) VALUES (?)";
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
          formattedDate,
          'en cours',
          'en cours',
        ];
  
        db.query(insertQuery, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Projet has been created.");
        });
      });
    });
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

export const GetIdProjet = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { titre_projet } = req.body;
  
  // Check if mail is provided
  if (!titre_projet) {
    return res.status(400).json({ message: "titre projet is required" });
  }

  const q = "SELECT id FROM projet WHERE titre_projet = ?  ";
  
  // Query the database
  db.query(q, [titre_projet], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}
export const Getdateprojet = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { titre_projet } = req.body;
  
  // Check if mail is provided
  if (!titre_projet) {
    return res.status(400).json({ message: "Titre de projet is required" });
  }

  const q = "SELECT   date_debut,date_fin,titre_projet FROM projet WHERE titre_projet = ? ";
  
  // Query the database
  db.query(q, [titre_projet], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

export const GetParticipantProjet = (req, res) => {
  // Destructure and sanitize the email and project title from the request body
  const { mail, titre_projet } = req.body;

  // Check if mail and project title are provided
  if (!mail) {
    return res.status(400).json({ message: "Mail is required" });
  }
  if (!titre_projet) {
    return res.status(400).json({ message: "Titre de projet is required" });
  }

  const q = "SELECT DISTINCT participant FROM projet WHERE mail = ? AND titre_projet = ?";
  
  // Query the database
  db.query(q, [mail, titre_projet], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    // Store unique participants in a Set to avoid duplicates
    const uniqueParticipants = new Set();

    // Iterate through the results and add each participant to the Set
    if (data && data.length > 0) {
      data.forEach((item) => {
        const combinedParticipants = item.participant;
        const individualParticipants = combinedParticipants.split("-");

        individualParticipants.forEach((name) => {
          uniqueParticipants.add(name.trim());
        });
      });
    }

    // Convert Set back to an array and format it as required
    const participants = Array.from(uniqueParticipants).map((participant) => ({
      participant: participant
    }));

    // Return the transformed data with unique participants
    return res.status(200).json(participants);
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

 