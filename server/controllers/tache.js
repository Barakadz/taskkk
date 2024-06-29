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
  const currentDate = moment();
  const formattedDate = currentDate.format('DD/MM/YYYY HH:mm:ss');

  // Convert input dates to MySQL date format
  const date_debut = moment(req.body.date_debut).format('YYYY-MM-DD');
  const date_fin = moment(req.body.date_fin).format('YYYY-MM-DD');

  const checkDateQuery = `
    SELECT * 
    FROM tache 
    WHERE (
      (date_debut <= ? AND date_fin >= ?) OR
      (date_debut <= ? AND date_fin >= ?) OR
      (date_debut >= ? AND date_debut <= ?) OR
      (date_fin >= ? AND date_fin <= ?)
    )
    AND mail = ? AND projet = ?
  `;

  db.query(checkDateQuery, [date_debut, date_debut, date_fin, date_fin, date_debut, date_fin, date_debut, date_fin, req.body.mail, req.body.projet], (err, data) => {
    if (err) return res.status(500).json({ error: err });

    if (data.length > 0) {
      return res.status(400).json("La plage de dates est déjà réservée par une autre tâche du même projet. Veuillez choisir une autre plage de dates pour cette tâche.");
    }

    const checkEmailQuery = "SELECT COUNT(id) AS tacheprojectCount FROM tache WHERE mail = ? AND projet = ?";
    db.query(checkEmailQuery, [req.body.mail, req.body.projet], (err, data) => {
      if (err) return res.status(500).json({ error: err });

      const projectCount = data[0].tacheprojectCount;
      if (projectCount === 3) {
        return res.status(400).json({ error: "Le nombre maximum de tâches pour un seul projet est de 3." });
      }

      const insertQuery = `
        INSERT INTO tache (
          titre_tache, level, description, equipe, date_debut, date_fin, etat, mail, projet, departement_user, validation, date, cause_responsable,validation_dg
        ) VALUES (?)`;

      const values = [
        req.body.titre_tache,
        req.body.level,
        req.body.description,
        req.body.equipe,
        date_debut, // Use the formatted date variables
        date_fin,   // Use the formatted date variables
        req.body.etat,
        req.body.mail,
        req.body.projet,
        req.body.departement_user,
        'en cours',
        formattedDate,
        'en cours',
        'en cours'
      ];

      db.query(insertQuery, [values], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json("Tache has been created.");
      });
    });
  });
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

  
 
    
    const q = "UPDATE `tache` SET `titre_tache` = ?,   `description` = ? , `equipe` = ? , `date_debut` = ? , `date_fin` = ? , `etat` = ? , `projet` = ? , `level` = ?     WHERE id = ?";
  
    db.query(q,[req.body.titre_tache,req.body.description,req.body.equipe,req.body.date_debut,req.body.date_fin,req.body.etat,req.body.projett,req.body.level,id], (err, userData) => {
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

 