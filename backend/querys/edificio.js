import express from 'express';
import { pool } from '../database/db.js';

export const CrearEdificioRouter = express.Router();

CrearEdificioRouter.post("/crearEdificio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, error: "Faltan datos" });
    }


    try {
        const result = await pool.query("INSERT INTO users (name) VALUES ($1) RETURNING *", [name]);
        res.json({ success: true, message: "Edificio creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});