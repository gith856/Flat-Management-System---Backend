import express from 'express';
import dotenv from "dotenv"
import rootRouter from "./routes/index.js"
import cors from 'cors';
import {fileURLToPath} from "url";
import path from "path";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 5000;

app.use(express.json())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://flat-management-system-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));



app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.get('/',(req,res)=>{
    res.send("Backend Running")
})

app.use('/api',rootRouter)

app.listen(PORT,()=>{
    console.log(`Server running on PORT no ${PORT}`)
})