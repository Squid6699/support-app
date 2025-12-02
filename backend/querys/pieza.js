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

//RUTA PARA OBTENER TODAS LAs SOLICITUDES DE PIEZAS
export const ObtenerSolicitudesPiezasRouter = express.Router();
ObtenerSolicitudesPiezasRouter.get("/obtenerSolicitudesPiezas", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query(`
            SELECT 
                SP.id AS solicitud_id,
                SP.fecha,
                SP.descripcion AS descripcion_solicitud,
                SP.cantidad AS cantidad_solicitada,
                SP.autorizado AS autorizado_solicitud,

                P.id AS pieza_id,
                P.nombre AS nombre_pieza,
                P.stock AS stock_pieza,

                T.id AS tecnico_id,
                T.nombre AS nombre_tecnico,

                P2.id AS encargado_id,
                P2.nombre AS nombre_encargado,

                I.id AS incidencia_id,
                I.fecha AS fechaincidencia,
                I.descripcion AS descripcion_incidencia,
                I.estado AS estado_incidencia,
                
                PR.id AS prioridad_id,
                PR.nombre AS prioridad,
                
                EQ.id AS equipo_id,
                EQ.nombre AS equipo_nombre,
                
                ED.id AS edificio_id,
                ED.nombre AS edificio,
                
                A.id AS aula_id,
                A.nombre AS aula,

                I.autorizada AS autorizada_incidencia

            FROM SolicitudPieza SP
            INNER JOIN Pieza P ON SP.pieza_id = P.id
            INNER JOIN Incidente I ON SP.incidente_id = I.id
            LEFT JOIN Persona T ON SP.tecnico_id = T.id
            INNER JOIN Equipo EQ ON I.equipo_id = EQ.id
            INNER JOIN Aula A ON EQ.aula_id = A.id
            INNER JOIN Edificio ED ON A.edificio_id = ED.id
            INNER JOIN Persona P2 ON ED.encargado_id = P2.id
            LEFT JOIN Prioridad PR ON I.prioridad_id = PR.id;

        `);
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

//Ruta para crear una solicitud de pieza
export const CrearSolicitudPiezaRouter = express.Router();
CrearSolicitudPiezaRouter.post("/crearSolicitudPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { pieza_id, incidente_id, cantidad, descripcion, tecnico_id } = req.body;

    if (!pieza_id || !incidente_id || !cantidad || !descripcion || !tecnico_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO SolicitudPieza (pieza_id, incidente_id, cantidad, descripcion, tecnico_id) VALUES ($1, $2, $3, $4, $5)",
            [pieza_id, incidente_id, cantidad, descripcion, tecnico_id]
        );
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, msg: "ERROR AL CREAR LA SOLICITUD DE PIEZA" });
        }

        res.json({ success: true, msg: "SOLICITUD DE PIEZA CREADA CORRECTAMENTE" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

// RUTA PARA AUTORIZAR O NO UNA SOLICITUD DE PIEZA
export const AutorizarSolicitudPiezaRouter = express.Router();
AutorizarSolicitudPiezaRouter.put("/autorizarSolicitudPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, autorizado } = req.body;

    if (!id || autorizado === undefined) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE SolicitudPieza SET autorizado = $1 WHERE id = $2",
            [autorizado, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "SOLICITUD DE PIEZA NO ENCONTRADA" });
        }

        res.json({ success: true, msg: "SOLICITUD DE PIEZA ACTUALIZADA CORRECTAMENTE" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});