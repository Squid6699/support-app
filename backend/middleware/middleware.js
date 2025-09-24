import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

export const middleware = express.Router();

const optionsCors = {
  origin: process.env.HOST_FRONTEND,
  credentials: true,
};

middleware.use(cors(optionsCors));
middleware.use(express.json());
middleware.use(cookieParser());