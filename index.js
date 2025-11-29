import express from 'express';
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());



// CORS MIDDLEWARE
app.use((req, res, next) => {
  // Define allowed frontend origins
  const allowedOrigins = [
    "http://localhost:5173",                       // local frontend
    process.env.DEV_ORIGIN,                        // dev deployed frontend
    process.env.PROD_ORIGIN                        // prod deployed frontend
  ].filter(Boolean); // remove undefined values

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, auth-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.get('/', (req, res) => res.send("Backend Running"));
app.use('/api', rootRouter);



// START SERVER
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));


// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import rootRouter from './routes/index.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS Middleware
// const allowedOrigins = [process.env.DEV_ORIGIN, process.env.PROD_ORIGIN, "http://localhost:5173"].filter(Boolean);

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   credentials: true
// }));

// // Parse JSON bodies
// app.use(express.json());

// // Serve static files (optional, e.g., for uploads)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.get('/', (req, res) => res.send("Backend Running"));
// app.use('/api', rootRouter);

// // Handle unknown routes
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// // Start server
// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
