import express from 'express';
import { pool } from '../database/db.js';

export const CrearEquipoRouter = express.Router();
export const ObtenerEquiposRouter = express.Router();
export const ObtenerEquipoRouter = express.Router();
export const EditarEquipoRouter = express.Router();
export const EliminarEquipoRouter = express.Router();
export const ObtenerEquiposEncargadoRouter = express.Router();
export const ObtenerDetallesEquiposRouter = express.Router();
export const ObtenerEquiposPorAulaRouter = express.Router();

// CrearEquipoRouter.post("/crearEquipo", async (req, res) => {
//     const customHeader = req.headers['x-frontend-header'];
//     if (customHeader !== 'frontend')
//         return res.status(401).send('Unauthorized');

//     const { nombre, fecha, aula_id, marca_id, tipo_id } = req.body;
//     if (!nombre || !fecha || !aula_id || !marca_id || !tipo_id)
//         return res.status(400).json({ success: false, msg: "Faltan datos" });

//     try {
//         const result = await pool.query(
//             "INSERT INTO equipo (nombre, fecha, aula_id, marca_id, tipo_id) VALUES ($1, $2, $3, $4, $5)",
//             [nombre, fecha, aula_id, marca_id, tipo_id]
//         );
//         res.json({ success: true, msg: "Equipo creado correctamente", result: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ success: false, msg: "Error en DB" });
//     }
// });

CrearEquipoRouter.post("/crearEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre, aula_id } = req.body;
    if (!nombre || !aula_id)
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });

    try {
        const result = await pool.query(
            "INSERT INTO equipo (nombre, aula_id) VALUES ($1, $2)",
            [nombre, aula_id]
        );
        res.json({ success: true, msg: "EQUIPO CREADO CORRECTAMENTE"});
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerEquiposRouter.get("/obtenerEquipos", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT id, nombre, fecha, aula_id FROM equipo");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerEquipoRouter.get("/obtenerEquipo/:id", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

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


// EditarEquipoRouter.put("/editarEquipo", async (req, res) => {
//     const customHeader = req.headers['x-frontend-header'];
//     if (customHeader !== 'frontend')
//         return res.status(401).send('Unauthorized');

//     const { id, nombre, fecha, aula_id, marca_id, tipo_id } = req.body;
//     if (!nombre || !fecha || !aula_id || !marca_id || !tipo_id)
//         return res.status(400).json({ success: false, msg: "Faltan datos" });

//     try {
//         const result = await pool.query(
//             "UPDATE equipo SET nombre=$1, fecha=$2, aula_id=$3, marca_id=$4, tipo_id=$5 WHERE id=$6",
//             [nombre, fecha, aula_id, marca_id, tipo_id, id]
//         );

//         if (result.rowCount === 0)
//             return res.status(404).json({ success: false, message: "Equipo no encontrado" });

//         res.json({ success: true, message: "Equipo actualizado correctamente", result: result.rows[0] });
//     } catch (err) {
//         res.status(500).json({ success: false, error: "Error en DB" });
//     }
// });

EditarEquipoRouter.put("/editarEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre, aula_id } = req.body;
    if (!nombre)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    let query = "UPDATE equipo SET nombre=$1, aula_id=$2 WHERE id=$3";

    if (!aula_id){
        query = "UPDATE equipo SET nombre=$1 WHERE id=$2";
    }

    try {
        const result = await pool.query(
            query,
            !aula_id ? [nombre, id] : [nombre, aula_id, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "EQUIPO NO ENCONTRADO" });

        res.json({ success: true, message: "EQUIPO ACTUALIZADO CORRECTAMENTE", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "OCURRIO UN ERROR" });
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
            return res.status(404).json({ success: false, message: "EQUIPO NO ENCONTRADO" });

        res.json({ success: true, message: "EQUIPO ELIMINADO CORRECTAMENTE" });
    } catch (err) {
        res.status(500).json({ success: false, error: "OCURRIO UN ERROR" });
    }
});


// Ruta para que el encargado de edificio pueda ver sus equipos

ObtenerEquiposEncargadoRouter.get("/verEquiposEncargado/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT EQ.id AS id, EQ.nombre AS nombreequipo, EQ.fecha AS fechaequipo, A.nombre AS nombreaula, E.nombre AS nombreedificio
            FROM equipo EQ
            INNER JOIN aula A ON EQ.aula_id = A.id
            INNER JOIN Edificio E ON A.edificio_id = E.id
            INNER JOIN Persona P ON E.encargado_id = P.id
            WHERE P.id = $1
        `, [id]);
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

// Ruta para que el encargado pueda ver detalles sobre los equipos

ObtenerDetallesEquiposRouter.get("/verDetallesEquipos/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT EQ.id AS id, 
            EQ.nombre AS nombreequipo, 
            EQ.fecha AS fechaequipo, 
            A.nombre AS nombreaula, 
            E.nombre AS nombreedificio, 
            I.id AS idincidente,
            I.descripcion AS descripcionincidente,
            Tec.nombre AS nombretecnico,
            PR.nombre AS prioridad,
            S.nombre AS nombreservicio,
            S.descripcion AS descripcionservicio,
            S.horas AS horasservicio,
            I.finalizado AS incidenciafinalizada,
            I.fecha_fin AS fechaterminoincidencia,
            S.calificacion AS calificacionservicio,
            I.autorizada AS autorizadaincidencia,
            I.estado AS estadoincidencia

            FROM equipo EQ
            INNER JOIN aula A ON EQ.aula_id = A.id
            INNER JOIN Edificio E ON A.edificio_id = E.id
            INNER JOIN Persona P ON E.encargado_id = P.id
            LEFT JOIN Incidente I ON I.equipo_id = EQ.id
            LEFT JOIN Persona Tec ON I.tecnico_id = Tec.id
            LEFT JOIN Prioridad PR ON I.prioridad_id = PR.id
            LEFT JOIN Servicio S ON I.servicio_id = S.id
            WHERE EQ.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron equipos para este encargado" });
        }

        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

// Ruta para obtener equipos por aula
ObtenerEquiposPorAulaRouter.get("/obtenerEquiposPorAula", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const query = `
            SELECT 
                a.id AS aula_id,
                a.nombre AS aula_nombre,
                e.id AS equipo_id,
                e.nombre AS equipo_nombre,
                e.fecha AS equipo_fecha,
                e.marca_id,
                e.tipo_id
            FROM Aula a
            LEFT JOIN Equipo e ON e.aula_id = a.id
            ORDER BY a.id;
    `;

        const result = await pool.query(query);

        // Agrupar aulas
        const aulasMap = new Map();

        result.rows.forEach(row => {
            const aulaId = row.aula_id;

            if (!aulasMap.has(aulaId)) {
                aulasMap.set(aulaId, {
                    id: aulaId,
                    nombre: row.aula_nombre,
                    equipos: []
                });
            }

            // Si el aula tiene equipos, agrégalos
            if (row.equipo_id) {
                aulasMap.get(aulaId).equipos.push({
                    id: row.equipo_id,
                    nombre: row.equipo_nombre,
                    fecha: row.equipo_fecha,
                    marca_id: row.marca_id,
                    tipo_id: row.tipo_id
                });
            }
        });

        // Convertir map → array
        const aulas = Array.from(aulasMap.values());

        res.json({ success: true, result: aulas });

    } catch (error) {
        res.status(500).json({ message: "OCURRIO UN ERROR" });
    }
});

// Ruta para obtener equipos por aula
export const ObtenerEquiposPorAulaIncidenciaRouter = express.Router();
ObtenerEquiposPorAulaIncidenciaRouter.get("/obtenerEquiposPorAulaIncidencia/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT id, nombre, aula_id
            FROM equipo
            WHERE aula_id = $1
        `, [id]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});