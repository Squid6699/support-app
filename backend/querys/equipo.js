import express from 'express';
import { pool } from '../database/db.js';

export const CrearEquipoRouter = express.Router();
export const ObtenerEquiposRouter = express.Router();
export const ObtenerEquipoRouter = express.Router();
export const EditarEquipoRouter = express.Router();
export const EliminarEquipoRouter = express.Router();

CrearEquipoRouter.post("/crearEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre, fecha, ubicacion_id, marca_id, tipo_id } = req.body;
    if (!nombre || !fecha || !ubicacion_id || !marca_id || !tipo_id)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO equipo (nombre, fecha, ubicacion_id, marca_id, tipo_id) VALUES ($1, $2, $3, $4, $5)",
            [nombre, fecha, ubicacion_id, marca_id, tipo_id]
        );
        res.json({ success: true, msg: "Equipo creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


ObtenerEquiposRouter.get("/obtenerEquipos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM equipo");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerEquipoRouter.get("/obtenerEquipo/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM equipo WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Equipo no encontrado" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


EditarEquipoRouter.put("/editarEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre, fecha, ubicacion_id, marca_id, tipo_id } = req.body;
    if (!nombre || !fecha || !ubicacion_id || !marca_id || !tipo_id)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "UPDATE equipo SET nombre=$1, fecha=$2, ubicacion_id=$3, marca_id=$4, tipo_id=$5 WHERE id=$6",
            [nombre, fecha, ubicacion_id, marca_id, tipo_id, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Equipo no encontrado" });

        res.json({ success: true, message: "Equipo actualizado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});


EliminarEquipoRouter.delete("/eliminarEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM equipo WHERE id=$1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Equipo no encontrado" });

        res.json({ success: true, message: "Equipo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});
