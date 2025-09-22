import express from 'express';
import { pool } from '../database/db.js';

export const CrearIncidenciaRouter = express.Router();
export const ObtenerIncidenciasRouter = express.Router();
export const ObtenerIncidenciaRouter = express.Router();
export const EditarIncidenciaRouter = express.Router();
export const EliminarIncidenciaRouter = express.Router();
export const ObtenerIncidenciaEquipoRouter = express.Router();
export const VerDetallesIncidenciaRouter = express.Router();
export const IniciarIncidenciaRouter = express.Router();
export const TerminarIncidenciaRouter = express.Router();
export const CalificarIncidenciaRouter = express.Router();
export const LiberarIncidenciaRouter = express.Router();
export const ObtenerIncidenciasEncargadoRouter = express.Router();
export const ActualizarEstadoIncidenciaRouter = express.Router();
export const AsignarTecnico = express.Router();
export const IncidenciasTecnicoRouter = express.Router();



CrearIncidenciaRouter.post("/crearIncidencia", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { fecha, descripcion, usuario_id, tecnico_id, equipo_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado } = req.body;

    if (!fecha || !descripcion || !usuario_id || !tecnico_id || !equipo_id || !prioridad_id || !servicio_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO incidente (fecha, descripcion, usuario_id, tecnico_id, equipo_id, prioridad_id, servicio_id, finalizado, calificacion, autorizada, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            [fecha, descripcion, usuario_id, tecnico_id, equipo_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado]
        );

        res.json({ success: true, msg: "Incidente creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerIncidenciasRouter.get("/obtenerIncidencias", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    try {
        const result = await pool.query("SELECT * FROM incidente");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerIncidenciaRouter.get("/obtenerIncidencia/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM incidente WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }
        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EditarIncidenciaRouter.put("/editarIncidencia", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id, fecha, descripcion, usuario_id, tecnico_id, equipo_id, tipo_incidente_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado } = req.body;

    if (!id || !fecha || !descripcion || !usuario_id || !tecnico_id || !equipo_id || !tipo_incidente_id || !prioridad_id || !servicio_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "UPDATE incidente SET fecha = $1, descripcion = $2, usuario_id = $3, tecnico_id = $4, equipo_id = $5, tipo_incidente_id = $6, prioridad_id = $7, servicio_id = $8, finalizado = $9, calificacion = $10, autorizada = $11, estado = $12 WHERE id = $13",
            [fecha, descripcion, usuario_id, tecnico_id, equipo_id, tipo_incidente_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }

        res.json({ success: true, msg: "Incidencia editada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EliminarIncidenciaRouter.delete("/eliminarIncidencia", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query("DELETE FROM incidente WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }
        res.json({ success: true, msg: "Incidencia eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

// Ruta para que el encargado de edificio pueda ver la incidencia de un equipo  

ObtenerIncidenciaEquipoRouter.get("/verIncidencia/:equipoId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { equipoId } = req.params;

    try {
        const result = await pool.query(`
            SELECT EQ.nombre AS nombreequipo, 
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
            I.calificacion AS calificacionincidencia,
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
        `, [equipoId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron incidencias para este equipo" });
        }

        res.json({ success: true, result: result.rows });
    } catch (err) {
        console.error("Error en la DB:", err);
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

// Ruta para que el tecnico pueda ver detalles de la incidencia asignada (Nombre, ubicacion, marca, tipo, piezas, incidencias anteriores).
VerDetallesIncidenciaRouter.get("/verDetallesIncidencia/:incidenciaId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { incidenciaId } = req.params;

    try {
        const resultIncidencia = await pool.query(`
            SELECT 
                i.fecha AS fechaIncidencia,
                e.id AS equipoId,
                e.nombre AS nombreEquipo, 
                TE.nombre AS tipoEquipo,
                M.nombre AS nombreMarca,
                STRING_AGG(PI.nombre, ', ') AS nombrePiezas,
                i.descripcion AS descripcionIncidencia,
                ED.nombre AS Edificio,
                A.nombre AS Aula,
                P.nombre AS nombreEncargado,
                PR.nombre AS nombrePrioridad
    
            FROM incidente I
            INNER JOIN persona P ON I.usuario_id = P.id
            INNER JOIN equipo E ON I.equipo_id = E.id
            INNER JOIN tipoequipo TE ON E.tipo_id = TE.id
            INNER JOIN marca M ON E.marca_id = M.id
            JOIN Equipo_Pieza EP ON e.id = EP.equipo_id
            JOIN Pieza PI ON PI.id = EP.pieza_id
            INNER JOIN prioridad PR ON I.prioridad_id = PR.id
            INNER JOIN aula A ON E.aula_id = A.id
            INNER JOIN Edificio ED ON A.edificio_id = ED.id
            WHERE I.id = $1
            GROUP BY 
                i.fecha, e.id, e.nombre, TE.nombre, 
                i.descripcion, P.nombre, M.nombre, PR.nombre,
                ED.nombre, A.nombre
            ORDER BY e.id;
        `, [incidenciaId]);

        if (resultIncidencia.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron detalles para esta incidencia" });
        }

        const equipoId = resultIncidencia.rows[0].equipoid;
        
        //CONSULTA PARA VER LAS INCIDENCIAS ANTERIORES DEL EQUIPO
        const resultIncidenciasAnteriores = await pool.query(`
            SELECT 
                i.fecha AS fechaIncidencia, 
                e.nombre AS nombreEquipo, 
                TE.nombre AS tipoEquipo,
                M.nombre AS nombreMarca,
                STRING_AGG(PI.nombre, ', ') AS nombrePiezas,
                i.descripcion AS descripcionIncidencia,
                ED.nombre AS Edificio,
                A.nombre AS Aula,
                P.nombre AS nombreEncargado,
                PR.nombre AS nombrePrioridad,
                S.nombre AS nombreServicio,
                S.descripcion AS descripcionServicio,
                S.horas AS horasServicio
                
            FROM incidente I
            INNER JOIN persona P ON I.usuario_id = P.id
            INNER JOIN equipo E ON I.equipo_id = E.id
            INNER JOIN tipoequipo TE ON E.tipo_id = TE.id
            INNER JOIN marca M ON E.marca_id = M.id
            JOIN Equipo_Pieza EP ON e.id = EP.equipo_id
            JOIN Pieza PI ON PI.id = EP.pieza_id
            INNER JOIN prioridad PR ON I.prioridad_id = PR.id
            INNER JOIN aula A ON E.aula_id = A.id
            INNER JOIN Edificio ED ON A.edificio_id = ED.id
            INNER JOIN servicio S ON I.servicio_id = S.id
            WHERE E.id = $1 AND I.id != $2
            GROUP BY 
                i.fecha, e.id, e.nombre, TE.nombre, 
                i.descripcion, P.nombre, M.nombre, PR.nombre,
                ED.nombre, A.nombre, S.nombre, S.descripcion, S.horas
            ORDER BY e.id;
        `, [equipoId, incidenciaId]);

        res.json({ success: true, 
            incidencia: resultIncidencia.rows[0], 
            incidenciasAnteriores: resultIncidenciasAnteriores.rows 
        });

    } catch (err) {
        return res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

//Ruta para que el tecnico pueda iniciar una incidencia.
IniciarIncidenciaRouter.put("/iniciarIncidencia", async (req, res) => {
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
            "UPDATE incidente SET estado = 'EN PROCESO' WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }

        res.json({ success: true, msg: "Incidencia iniciada correctamente" });
    } catch (err) {
        return res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});


//Ruta para que el tecnico pueda terminar una incidencia.
TerminarIncidenciaRouter.put("/terminarIncidencia", async (req, res) => {
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
            "UPDATE incidente SET estado = 'TERMINADO', fecha_fin = NOW() WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }

        res.json({ success: true, msg: "Incidencia terminada correctamente" });
    } catch (err) {
        return res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

//Ruta para que el encargado pueda dar una calificacion a la incidencia.
CalificarIncidenciaRouter.put("/calificarIncidencia", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, calificacion } = req.body;

    if (!id || !calificacion) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "UPDATE incidente SET calificacion = $1 WHERE id = $2",
            [calificacion, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }

        res.json({ success: true, msg: "Incidencia calificada correctamente" });
    } catch (err) {
        return res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

//Ruta para que el encargado de edificio pueda liberar las incidencias en estado terminado.
LiberarIncidenciaRouter.put("/liberarIncidencia", async (req, res) => {
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
            "UPDATE incidente SET estado = 'LIBERADO', finalizado = true WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Incidencia no encontrada" });
        }

        res.json({ success: true, msg: "Incidencia liberada correctamente" });
    } catch (err) {
        return res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

// Ruta para que el encargado de edificio pueda ver sus incidencias.

ObtenerIncidenciasEncargadoRouter.get("/verIncidenciasEncargado/:personaId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { personaId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                i.id AS incidencia_id,
                i.fecha as fechaincidencia,
                i.descripcion as descripcion_incidencia,
                i.estado AS estado_incidencia,
                pr.nombre AS prioridad,
                eq.id AS equipo_id,
                eq.nombre AS equipo_nombre,
                ED.nombre AS edificio,
                A.nombre AS aula
            FROM incidente i
            INNER JOIN equipo eq ON i.equipo_id = eq.id
            INNER JOIN aula A ON E.aula_id = A.id
            INNER JOIN Edificio ED ON A.edificio_id = ED.id
            INNER JOIN persona p ON ed.encargado_id = p.id
            INNER JOIN prioridad pr ON i.prioridad_id = pr.id
            WHERE p.id = $1
            ORDER BY i.fecha DESC
        `, [personaId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron incidencias para este encargado" });
        }

        res.json({ success: true, result: result.rows });
    } catch (err) {
        console.error("Error en la DB:", err);
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

// Ruta para que el encargado de edificio acepte o rechace una incidencia.

ActualizarEstadoIncidenciaRouter.put("/actualizarIncidencia/:incidenciaId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { incidenciaId } = req.params;
    const { estado } = req.body; 

    if (!["aceptada", "rechazada"].includes(estado)) {
        return res.status(400).json({ success: false, msg: "Estado inválido. Solo se permite 'aceptada' o 'rechazada'." });
    }

    try {
        const result = await pool.query(
            `UPDATE incidente 
             SET estado = $1
             WHERE id = $2
             RETURNING id, estado`,
            [estado, incidenciaId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontró la incidencia" });
        }

        res.json({ success: true, msg: "Incidencia actualizada", result: result.rows[0] });
    } catch (err) {
        console.error("Error en la DB:", err);
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

// Ruta para que el administrador asigne un técnico a una incidencia

AsignarTecnico.put("/asignarTecnico/:incidenciaId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { incidenciaId } = req.params;
    const { tecnicoId } = req.body;

    if (!tecnicoId) {
        return res.status(400).json({ success: false, msg: "Debes proporcionar el ID del técnico" });
    }

    try {
        const result = await pool.query(
            `UPDATE incidente
             SET tecnico_id = $1
             WHERE id = $2
             RETURNING id, tecnico_id`,
            [tecnicoId, incidenciaId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontró la incidencia" });
        }

        res.json({ success: true, msg: "Técnico asignado correctamente", result: result.rows[0] });
    } catch (err) {
        console.error("Error en la DB:", err);
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

//-Ruta para que el tecnico pueda ver sus incidencias asignadas. 

IncidenciasTecnicoRouter.get("/incidenciasTecnico/:tecnicoId", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { tecnicoId } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                i.id,i.fecha, i.hora,i.descripcion,i.estado,i.prioridad_id,
                p.nombre AS prioridad,i.marca_id,m.nombre AS marca,i.tipoequipo_id,
                t.nombre AS tipo_equipo,i.fecha_solucion,i.hora_solucion,i.solucion
             FROM incidente i
             LEFT JOIN prioridad p ON i.prioridad_id = p.id
             LEFT JOIN marca m ON i.marca_id = m.id
             LEFT JOIN tipoequipo t ON i.tipoequipo_id = t.id
             WHERE i.tecnico_id = $1
             ORDER BY i.fecha DESC, i.hora DESC`,
            [tecnicoId]
        );

        res.json({ success: true, incidencias: result.rows });
    } catch (err) {
        console.error("Error al obtener incidencias del técnico:", err);
        res.status(500).json({ success: false, msg: "Error en la base de datos" });
    }
});

