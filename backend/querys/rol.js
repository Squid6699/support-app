import express from 'express';
import { pool } from '../database/db.js';

export const CrearRolRouter = express.Router();
export const ObtenerRolesRouter = express.Router();
export const ObtenerRolRouter = express.Router();
export const EditarRolRouter = express.Router();
export const EliminarRolRouter = express.Router();


CrearRolRouter.post("/crearRol", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre } = req.body;
    if (!nombre)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO rol (nombre) VALUES ($1)",
            [nombre]
        );
        res.json({ success: true, msg: "Rol creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerRolesRouter.get("/obtenerRoles", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM rol");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerRolRouter.get("/obtenerRol/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM rol WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Rol no encontrado" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EditarRolRouter.put("/editarRol", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre } = req.body;

    try {
        const result = await pool.query(
            "UPDATE rol SET nombre=$1 WHERE id=$2 RETURNING *",
            [nombre, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Rol no encontrado" });

        res.json({ success: true, message: "Rol actualizado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

EliminarRolRouter.delete("/eliminarRol", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM rol WHERE id=$1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Rol no encontrado" });

        res.json({ success: true, message: "Rol eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});
