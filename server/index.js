import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
import projetRoutes from "./routes/projet.js";
 
import directeurRoutes from "./routes/directeur.js";
import employeRoutes from "./routes/employe.js";
import evaluationRoutes from "./routes/evaluation.js";
import contactRoutes from "./routes/contact.js";

import tacheRoutes from "./routes/tache.js";
import validprojetRoutes from "./routes/validprojet.js";
import validtacheRoutes from "./routes/validtache.js";
import rhRoutes from "./routes/rh.js";
import dgRoutes from "./routes/dg.js";
import tousProjetValide from "./routes/validationtousprojet.js";
import tousPrimeValide from "./routes/prime.js";



import cookieParser from "cookie-parser";


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });



app.use(express.json())

app.use(cors({
origin:'*',
}));

//pour inserer les cookie 
app.use(cookieParser());




app.use("/api/projet", projetRoutes);
app.use("/api/directeur", directeurRoutes);
app.use("/api/employe@groupe", employeRoutes);

app.use("/api/tache", tacheRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/projetvalide", validprojetRoutes);
app.use("/api/tachevalide", validtacheRoutes);
app.use("/api/rh", rhRoutes);
app.use("/api/dg", dgRoutes);
app.use("/api/tousprojetvalidation", tousProjetValide);
app.use("/api/primeee", tousPrimeValide);

 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(8800, () => {
  console.log("API working");
});
