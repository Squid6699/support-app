import express from "express";
import { pool } from '../database/db.js';

export const CrearPiezaRouter = express.Router();
export const ObtenerPiezasRouter = express.Router();
export const ObtenerPiezaRouter = express.Router();
export const EditarPiezaRouter = express.Router();
export const EliminarPiezaRouter = express.Router();

CrearPiezaRouter.post("/crearPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { nombre, stock } = req.body;


    if (!nombre || !stock) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO pieza (nombre, stock) VALUES ($1, $2)",
            [nombre, stock]
        );

        console.log(result);

        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, msg: "ERROR AL CREAR LA PIEZA" });
        }

        res.json({ success: true, msg: "PIEZA CREADA CORRECTAMENTE" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerPiezasRouter.get("/obtenerPiezas", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT id, nombre, stock FROM Pieza");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});


ObtenerPiezaRouter.get("/obtenerPieza/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM pieza WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Pieza no encontrada" });
        }
        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EditarPiezaRouter.put("/editarPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, nombre, stock } = req.body;

    if (!id || !nombre || !stock) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }
    try {
        const result = await pool.query(
            "UPDATE pieza SET nombre = $1, stock = $2 WHERE id = $3",
            [nombre, stock, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "PIEZA NO ENCONTRADA" });
        }
        res.json({ success: true, msg: "PIEZA ACTUALIZADA CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

export const EditarStockPiezaRouter = express.Router();

EditarStockPiezaRouter.put("/editarStockPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, stock } = req.body;

    if (!id || stock === undefined) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE pieza SET stock = $1 WHERE id = $2",
            [stock, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "PIEZA NO ENCONTRADA" });
        }
        res.json({ success: true, msg: "STOCK ACTUALIZADO CORRECTAMENTE" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EliminarPiezaRouter.delete("/eliminarPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query("DELETE FROM pieza WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Pieza no encontrada" });
        }
        res.json({ success: true, msg: "PIEZA ELIMINADA CORRECTAMENTE" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

// NO TERMINADO
//Ruta para crear una solicitud de pieza
