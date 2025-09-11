import exrpess from 'express';

export const CrearIncidenciaRouter = exrpess.Router();
export const ObtenerIncidenciasRouter = exrpess.Router();
export const ObtenerIncidenciaRouter = exrpess.Router();
export const EditarIncidenciaRouter = exrpess.Router();
export const EliminarIncidenciaRouter = exrpess.Router();

CrearIncidenciaRouter.post("/crearIncidencia", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend'){
        return res.status(401).send('Unauthorized');
    }

    const { fecha, descripcion, usuario_id, tecnico_id, equipo_id, tipo_incidente_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado } = req.body;

    if (!fecha || !descripcion || !usuario_id || !tecnico_id || !equipo_id || !tipo_incidente_id || !prioridad_id || !servicio_id) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO incidente (fecha, descripcion, usuario_id, tecnico_id, equipo_id, tipo_incidente_id, prioridad_id, servicio_id, finalizado, calificacion, autorizada, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            [fecha, descripcion, usuario_id, tecnico_id, equipo_id, tipo_incidente_id, prioridad_id, servicio_id, finalizado, calificacion, autorizado, estado]
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
