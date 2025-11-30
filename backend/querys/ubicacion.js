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

    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Edificio (nombre) VALUES ($1)",
            [nombre]
        );

        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, msg: "NO SE PUDO CREAR EL EDIFICIO" });
        }

        res.json({ success: true, msg: "EDIFICIO CREADO CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

CrearAulaRouter.post('/crearAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { nombre, edificio_id } = req.body;

    if (!nombre || !edificio_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Aula (nombre, edificio_id) VALUES ($1, $2)",
            [nombre, edificio_id]
        );
        res.json({ success: true, msg: "AULA CREADA CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
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
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
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
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EditarEdificioRouter.put('/editarEdificio', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, nombre, encargado_id } = req.body;

    if (!id || !nombre || !encargado_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE Edificio SET nombre = $1, encargado_id = $2 WHERE id = $3",
            [nombre, encargado_id, id]
        );
        res.json({ success: true, msg: "Edificio editado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EditarAulaRouter.put('/editarAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id, nombre, edificio_id } = req.body;

    if (!id || !nombre || !edificio_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE Aula SET nombre = $1, edificio_id = $2 WHERE id = $3",
            [nombre, edificio_id, id]
        );
        res.json({ success: true, msg: "Aula editada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EliminarEdificioRouter.delete('/eliminarEdificio', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM Edificio WHERE id = $1",
            [id]
        );
        res.json({ success: true, msg: "Edificio eliminado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EliminarAulaRouter.delete('/eliminarAula', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM Aula WHERE id = $1",
            [id]
        );
        res.json({ success: true, msg: "Aula eliminada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerAulasPorEdificioRouter.get('/obtenerAulasPorEdificio/:edificioId', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { edificioId } = req.params;

    if (!edificioId) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM Aula WHERE edificio_id = $1",
            [edificioId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerEdificiosPorEncargadoRouter.get('/obtenerEdificiosPorEncargado/:encargadoId', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { encargadoId } = req.params;

    if (!encargadoId) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM Edificio WHERE encargado_id = $1",
            [encargadoId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});


// Ruta para obtener los edificios con sus aulas y los equipos de cada aula
export const ObtenerEdificiosConAulasYEquiposRouter = express.Router();

ObtenerEdificiosConAulasYEquiposRouter.get('/obtenerEdificiosConAulasYEquiposAdmin', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query(`
            SELECT 
                ED.id AS edificio_id,
                ED.nombre AS edificio_nombre,
                P.id AS persona_id,
                P.nombre AS persona_nombre,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'aula_id', A.id,
                            'aula_nombre', A.nombre,
                            'equipos', (
                                SELECT JSON_AGG(
                                    JSON_BUILD_OBJECT(
                                        'equipo_id', E.id,
                                        'equipo_nombre', E.nombre,
                                        'equipo_fecha', E.fecha
                                    )
                                )
                                FROM equipo E
                                WHERE E.aula_id = A.id
                            )
                        )
                    ) FILTER (WHERE A.id IS NOT NULL),
                    '[]'
                ) AS aulas
            FROM edificio ED
            LEFT JOIN persona P ON ED.encargado_id = P.id
            LEFT JOIN aula A ON A.edificio_id = ED.id
            GROUP BY ED.id, ED.nombre, P.id, P.nombre;
        `);

        res.json({ success: true, result: result.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

//Ruta para asignar encargado a un edificio
export const AsignarEncargadoRouter = express.Router();
AsignarEncargadoRouter.put('/asignarEncargado', async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { edificio_id, encargado_id } = req.body;

    if (!edificio_id || !encargado_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE edificio SET encargado_id=$1 WHERE id=$2",
            [encargado_id, edificio_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "EDIFICIO NO ENCONTRADO" });
        }

        res.json({ success: true, msg: "ENCARGADO ASIGNADO CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});