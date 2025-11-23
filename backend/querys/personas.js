import express from 'express';
import { pool } from '../database/db.js';

export const CrearPersonaRouter = express.Router();
export const ObtenerPersonasRouter = express.Router();
export const ObtenerPersonaRouter = express.Router();
export const EditarPersonaRouter = express.Router();
export const EliminarPersonaRouter = express.Router();
export const ObtenerTecnicosRouter = express.Router();


CrearPersonaRouter.post("/crearPersona", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre, celular, correo, contraseña, rol_id } = req.body;
    if (!nombre || !correo || !contraseña)
        return res.status(400).json({ success: false, msg: "Faltan datos " });

    try {
        const result = await pool.query(
            "INSERT INTO persona (nombre, celular, correo, contraseña, rol_id) VALUES ($1, $2, $3, $4, $5)",
            [nombre, celular, correo, contraseña, rol_id]
        );
        res.json({ success: true, msg: "USUARIO CREADO CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerPersonasRouter.get("/obtenerPersonas", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM persona");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerPersonaRouter.get("/obtenerPersona/:id", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM persona WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Persona no encontrada" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


EditarPersonaRouter.put("/editarPersona", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre, celular, correo, contraseña, rol_id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE persona SET nombre=$1, celular=$2, correo=$3, contraseña=$4, rol_id=$5 WHERE id=$6 RETURNING *",
            [nombre, celular, correo, contraseña, rol_id, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Persona no encontrada" });

        res.json({ success: true, message: "Persona actualizada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});


EliminarPersonaRouter.delete("/eliminarPersona", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM persona WHERE id=$1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Persona no encontrada" });

        res.json({ success: true, message: "Persona eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

ObtenerTecnicosRouter.get("/obtenerTecnicos", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query(`SELECT P.id AS id, P.nombre AS nombre, P.celular AS celular, P.correo AS correo, R.nombre AS rol 
            FROM persona P
            INNER JOIN rol R ON P.rol_id = R.id
            WHERE rol_id = 2 OR rol_id = 3`
        );
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

// Ruta para obtener a todos los encargados de edificios
export const ObtenerEncargadosRouter = express.Router();
ObtenerEncargadosRouter.get("/obtenerEncargados", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query(`
            SELECT P.id AS id, P.nombre AS nombre, P.celular AS celular, P.correo AS correo, R.nombre AS rol
            FROM persona P
            INNER JOIN rol R ON P.rol_id = R.id
            WHERE rol_id = 4
        `);
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});