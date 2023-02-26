import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/auth.route";
import filesRoutes from "./routes/files.route";
import profileRoutes from "./routes/profile.route";

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/cloud-drive')
    .then(() => console.log('MongoDB connected'))
    .catch(e => console.error(`MongoDB connection error: ${e}`));

const app = express();
const PORT: number = (process.env.PORT as number | undefined) || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(fileUpload());
app.disable('x-powered-by');

app.use('/api/auth', authRoutes);
app.use('/api/file', filesRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));