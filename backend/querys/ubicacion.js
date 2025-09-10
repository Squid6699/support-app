import express from 'express';
import { pool } from '../database/db.js';

export const CrearUbicacionRouter = express.Router();
export const ObtenerUbicacionesRouter = express.Router();
export const ObtenerUbicacionRouter = express.Router();
export const EditarUbicacionRouter = express.Router();
export const EliminarUbicacionRouter = express.Router();

CrearUbicacionRouter.post("/crearUbicacion", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { edificio, aula, persona_id } = req.body;
    if (!edificio || !aula || !persona_id)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO Ubicacion (edificio, aula, persona_id) VALUES ($1, $2, $3)",
            [edificio, aula, persona_id]
        );
        res.json({ success: true, msg: "Ubicacion creada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerUbicacionesRouter.get("/obtenerUbicaciones", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Ubicacion");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

// Obtener Ubicacion por id
ObtenerUbicacionRouter.get("/obtenerUbicacion/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM Ubicacion WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Ubicacion no encontrada" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


EditarUbicacionRouter.put("/editarUbicacion", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, edificio, aula, persona_id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE Ubicacion SET edificio=$1, aula=$2, persona_id=$3 WHERE id=$4 ",
            [edificio, aula, persona_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Ubicacion no encontrada" });
        }

        res.json({ success: true, message: "Ubicacion actualizada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

EliminarUbicacionRouter.delete("/eliminarUbicacion", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM Ubicacion WHERE id=$1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Ubicacion no encontrada" });
        }

        res.json({ success: true, message: "Ubicacion eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});
