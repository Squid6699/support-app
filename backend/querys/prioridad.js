import express from 'express';
import { pool } from '../database/db.js';

export const CrearPrioridadRouter = express.Router();
export const ObtenerPrioridadesRouter = express.Router();
export const ObtenerPrioridadRouter = express.Router();
export const EditarPrioridadRouter = express.Router();
export const EliminarPrioridadRouter = express.Router();


CrearPrioridadRouter.post("/crearPrioridad", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre } = req.body;
    if (!nombre)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO prioridad (nombre) VALUES ($1) RETURNING *",
            [nombre]
        );
        res.json({ success: true, msg: "Prioridad creada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


ObtenerPrioridadesRouter.get("/obtenerPrioridades", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prioridad");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


ObtenerPrioridadRouter.get("/obtenerPrioridad/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM prioridad WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Prioridad no encontrada" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


EditarPrioridadRouter.put("/editarPrioridad", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre } = req.body;

    if (!nombre)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "UPDATE prioridad SET nombre=$1 WHERE id=$2 RETURNING *",
            [nombre, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Prioridad no encontrada" });

        res.json({ success: true, message: "Prioridad actualizada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});


EliminarPrioridadRouter.delete("/eliminarPrioridad", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM prioridad WHERE id=$1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Prioridad no encontrada" });

        res.json({ success: true, message: "Prioridad eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});
