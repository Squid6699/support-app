import express from 'express';
import { pool } from '../database/db.js';

export const CrearServicioRouter = express.Router();
export const ObtenerServiciosRouter = express.Router();
export const ObtenerServicioRouter = express.Router();
export const EditarServicioRouter = express.Router();
export const EliminarServicioRouter = express.Router();
export const ObtenerServiciosDeTecnicoRouter = express.Router();
export const ObtenerDetallesServicioRouter = express.Router();
export const ObtenerServiciosDeEquiposRouter = express.Router();

CrearServicioRouter.post("/crearServicio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id_incidencia, nombre, descripcion, horas, tecnico_id } = req.body;

    if (!nombre || !descripcion || !tecnico_id || !horas || !id_incidencia)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO servicio ( nombre, descripcion, tecnico_id, horas) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, descripcion, tecnico_id, horas]
        );

        const resultIncidencia = await pool.query(
            "UPDATE Incidente SET servicio_id=$1, estado = 'TERMINADO' WHERE id=$2",
            [result.rows[0].id, id_incidencia]
        );


        res.json({ success: true, msg: "Servicio creado correctamente" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


ObtenerServiciosRouter.get("/obtenerServicios", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM Servicio");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerServicioRouter.get("/obtenerServicio/:id", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM servicio WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Servicio no encontrado" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


EditarServicioRouter.put("/editarServicio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre, descripcion, tecnico_id, horas } = req.body;
    if (!nombre || !descripcion || !tecnico_id || !horas || !tipo_id)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "UPDATE servicio SET nombre=$1, descripcion=$2, tecnico_id=$3, horas=$4 WHERE id=$5",
            [nombre, descripcion, tecnico_id, horas, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Servicio no encontrado" });

        res.json({ success: true, message: "Servicio actualizado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});


EliminarServicioRouter.delete("/eliminarServicio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id } = req.body;

    try {
        const result = await pool.query("DELETE FROM servicio WHERE id=$1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ success: false, message: "Servicio no encontrado" });

        res.json({ success: true, message: "Servicio eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error en DB" });
    }
});

//Ruta para que el tecnico pueda ver sus servicios dados.
// NO TERMINADO
ObtenerServiciosDeTecnicoRouter.get("/obtenerServiciosDeTecnico/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    // QUITAR EL *
    // OBTENER FECHA, DESCRIPCION, PERSONA QUE SOLICITO (usuario_id), EQUIPO (innerjoin a equipos), PRIORIDAD (innerjoin a prioridad), DATOS DEL SERVICIO (nombre, descripcion, horas), CALIFICACION DEL SERVICIO (inner join a servicio)

    try {
        const result = await pool.query("SELECT * FROM Servicio WHERE tecnico_id=$1", [id]);
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

//Ruta para que el tecnico pueda ver los detalles de los servicios dados.
ObtenerDetallesServicioRouter.get("/obtenerDetallesServicio/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT S.nombre AS nombreServicio, 
            S.descripcion AS descripcionServicio, 
            S.horas AS horasServicio, 
            I.fecha AS fechaIncidencia, 
            I.descripcion descripcionIncidencia, 
            E.nombre AS nombreEquipo, 
            P.nombre AS Prioridad, 
            I.finalizado AS finalizadoIncidencia, 
            S.calificacion AS calificacionServicio, 
            I.estado AS estadoIncidencia
            FROM incidente I
            INNER JOIN servicio S ON I.servicio_id = S.id
            INNER JOIN equipo E ON I.equipo_id = E.id
            INNER JOIN prioridad P ON I.prioridad_id = P.id
            WHERE S.id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Servicio no encontrado" });
        }

        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

// Ruta para que el encargado pueda ver los servicios de sus equipos
ObtenerServiciosDeEquiposRouter.get("/obtenerServiciosDeEquipos/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                EQ.id AS id_equipo,
                EQ.nombre AS nombre_equipo,
                EQ.fecha AS fecha_equipo,
                A.nombre AS nombre_aula,
                E.nombre AS nombre_edificio,
                json_agg(
                    json_build_object(
                        'id_incidencia', I.id,
                        'descripcion_incidencia', I.descripcion,
                        'nombre_tecnico', Tec.nombre,
                        'prioridad', PR.nombre,
                        'nombre_servicio', S.nombre,
                        'descripcion_servicio', S.descripcion,
                        'horas_servicio', S.horas,
                        'incidencia_finalizada', I.finalizado,
                        'fecha_termino_incidencia', I.fecha_fin,
                        'calificacion_servicio', S.calificacion,
                        'autorizada_incidencia', I.autorizada,
                        'estado_incidencia', I.estado
                    )
                ) FILTER (WHERE I.id IS NOT NULL) AS servicios
            FROM equipo EQ
            INNER JOIN aula A ON EQ.aula_id = A.id
            INNER JOIN edificio E ON A.edificio_id = E.id
            INNER JOIN persona P ON E.encargado_id = P.id
            LEFT JOIN incidente I ON I.equipo_id = EQ.id
            LEFT JOIN persona Tec ON I.tecnico_id = Tec.id
            LEFT JOIN prioridad PR ON I.prioridad_id = PR.id
            LEFT JOIN servicio S ON I.servicio_id = S.id
            WHERE P.id = $1
            GROUP BY EQ.id, EQ.nombre, EQ.fecha, A.nombre, E.nombre
            ORDER BY EQ.nombre;
        `, [id]);

        res.json({ success: true, result: result.rows });

    } catch (error) {
        console.error('Error al obtener los servicios de equipos:', error);
        res.status(500).send('Error interno del servidor');
    }
});
