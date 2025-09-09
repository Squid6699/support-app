import express from 'express';
import { pool } from '../database/db.js';

export const UbicacionRouter = express.Router();

UbicacionRouter.post("/crearUbicacion", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') 
        return res.status(401).send('Unauthorized');

    const { edificio, aula, persona_id } = req.body;
    if (!edificio || !aula || !persona_id) 
        return res.status(400).json({ success: false, error: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO Ubicacion (edificio, aula, persona_id) VALUES ($1, $2, $3) RETURNING *",
            [edificio, aula, persona_id]
        );
        res.json({ success: true, message: "Ubicacion creada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

UbicacionRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Ubicacion");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

// Obtener Ubicacion por id
UbicacionRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Ubicacion WHERE id=$1", [id]);
        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});


UbicacionRouter.put("/editarUbicacion/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { edificio, aula, persona_id } = req.body;
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE Ubicacion SET edificio=$1, aula=$2, persona_id=$3 WHERE id=$4 ",
            [edificio, aula, persona_id, id]
        );
        res.json({ success: true, message: "Ubicacion actualizada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

UbicacionRouter.delete("/eliminarUbicacion/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') 
        return res.status(401).send('Unauthorized');

    const { id } = req.params;

    try {
        await pool.query("DELETE FROM Ubicacion WHERE id=$1", [id]);
        res.json({ success: true, message: "Ubicacion eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});
