import { db } from "../connect.js";
 
export const GetTousPrimes = (req, res) => {

  
   

  const q = "SELECT * FROM tache WHERE  validation_dg ='valide' and validation='valide' order by level desc";
  
  // Query the database
  db.query(q, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}













export const AddPrime = (req, res) => {
  const equipe = req.body.equipe;
  const users = equipe.split('-');

  const getSalary = (user, callback) => {
    const salaryQuery = "SELECT salaire FROM `employe` WHERE `username` = ?";
    db.query(salaryQuery, [user], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) {
        callback(null, results[0].salaire);
      } else {
        callback(new Error(`Salary for user ${user} not found`));
      }
    });
  };

  const checkAndUpsertPrime = (user, mois, level, callback) => {
    getSalary(user, (err, salaire) => {
      if (err) return callback(err);


      let levell;
      if (level == 5) {
        levell = salaire * 0.25; // Calculate the prime
      } else if (level == 4) {
        levell = salaire * 0.20; // Calculate the prime
      } else if (level == 3) {
        levell = salaire * 0.15; // Calculate the prime
      } else if (level == 2) {
        levell = salaire * 0.10; // Calculate the prime
      } else if (level == 1) {
        levell = salaire * 0.05; // Calculate the prime
      } else {
        levell = 0;
      }

 

      const prime = levell; // Use the calculated prime

      const checkQuery = "SELECT * FROM `prime` WHERE `username` = ? AND `mois` = ?";
      db.query(checkQuery, [user, mois], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
          // Record exists, check the level
          const existingRecord = results[0];
          if (existingRecord.level < level) {
            // Level is higher, update the record
            const updateQuery = "UPDATE `prime` SET `level` = ?, `prime` = ?, `salaire` = ? WHERE `username` = ? AND `mois` = ?";
            db.query(updateQuery, [level, prime, salaire, user, mois], callback);
          } else {
            // Level is not higher, no update needed
            callback(null);
          }
        } else {
          // Record does not exist, insert new record
          const insertQuery = "INSERT INTO `prime` (`username`, `mois`, `level`, `prime`, `salaire`) VALUES (?, ?, ?, ?, ?)";
          db.query(insertQuery, [user, mois, level, prime, salaire], callback);
        }
      });
    });
  };

  const processUsers = (index) => {
    if (index >= users.length) {
      // All users processed, now handle the specific user
      const specificUser = req.body.username.trim();
      checkAndUpsertPrime(specificUser, req.body.mois, req.body.level, (err) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json(err);
        }
        return res.status(200).json("Prime has been created or updated for all users in the equipe and for the specific user.");
      });
      return;
    }

    const user = users[index].trim();
    checkAndUpsertPrime(user, req.body.mois, req.body.level, (err) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json(err);
      }
      // Process next user
      processUsers(index + 1);
    });
  };

  // Start processing users
  processUsers(0);
};



export const mailPrime = (req, res) => {

  
  // Destructure and sanitize the email from the request body
  const { mail } = req.body;
  
  // Check if mail is provided
  if (!mail) {
    return res.status(400).json({ message: "Mail is required" });
  }

  const q = "SELECT * FROM prime WHERE username = ? order by id desc";
  
  // Query the database
  db.query(q, [mail], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}

export const GetAllPrimes = (req, res) => {

  
  
  const q = "SELECT * FROM prime  order by username";
  
  // Query the database
  db.query(q,   (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.status(200).json(data);
  });
}