import express from 'express';
import { pool } from '../database/db.js';

export const CrearEdificioRouter = express.Router();
export const CrearAulaRouter = express.Router();
export const ObtenerEdificiosRouter = express.Router();
export const ObtenerAulasRouter = express.Router();
export const EditarEdificioRouter = express.Router();
export const EditarAulaRouter = express.Router();
export const EliminarEdificioRouter = express.Router();
export const EliminarAulaRouter = express.Router();
export const ObtenerAulasPorEdificioRouter = express.Router();
export const ObtenerEdificiosPorEncargadoRouter = express.Router();

CrearEdificioRouter.post('/crearEdificio', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { nombre, encargado_id } = req.body;

    if (!nombre || !encargado_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Edificio (nombre, encargado_id) VALUES ($1, $2)",
            [nombre, encargado_id]
        );
        res.json({ success: true, msg: "Edificio creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

CrearAulaRouter.post('/crearAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { nombre, edificio_id } = req.body;

    if (!nombre || !edificio_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Aula (nombre, edificio_id) VALUES ($1, $2)",
            [nombre, edificio_id]
        );
        res.json({ success: true, msg: "Aula creada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerEdificiosRouter.get('/obtenerEdificios', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM Edificio");
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerAulasRouter.get('/obtenerAulas', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM Aula");
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EditarEdificioRouter.put('/editarEdificio', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, nombre, encargado_id } = req.body;

    if (!id || !nombre || !encargado_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "UPDATE Edificio SET nombre = $1, encargado_id = $2 WHERE id = $3",
            [nombre, encargado_id, id]
        );
        res.json({ success: true, msg: "Edificio editado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EditarAulaRouter.put('/editarAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id, nombre, edificio_id } = req.body;

    if (!id || !nombre || !edificio_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "UPDATE Aula SET nombre = $1, edificio_id = $2 WHERE id = $3",
            [nombre, edificio_id, id]
        );
        res.json({ success: true, msg: "Aula editada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }   
});

EliminarEdificioRouter.delete('/eliminarEdificio', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM Edificio WHERE id = $1",
            [id]
        );
        res.json({ success: true, msg: "Edificio eliminado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EliminarAulaRouter.delete('/eliminarAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM Aula WHERE id = $1",
            [id]
        );
        res.json({ success: true, msg: "Aula eliminada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerAulasPorEdificioRouter.get('/obtenerAulasPorEdificio/:edificioId', async (req, res) => {
    const customHeader = req.headers['x-frontend-header']; 
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { edificioId } = req.params;

    if (!edificioId) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM Aula WHERE edificio_id = $1",
            [edificioId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerEdificiosPorEncargadoRouter.get('/obtenerEdificiosPorEncargado/:encargadoId', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }  
    const { encargadoId } = req.params;

    if (!encargadoId) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM Edificio WHERE encargado_id = $1",
            [encargadoId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});
