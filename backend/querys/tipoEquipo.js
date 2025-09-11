import express from "express";

export const CrearTipoEquipoRouter = express.Router();
export const ObtenerTiposEquiposRouter = express.Router();
export const ObtenerTipoEquipoRouter = express.Router();
export const EditarTipoEquipoRouter = express.Router();
export const EliminarTipoEquipoRouter = express.Router();

CrearTipoEquipoRouter.post("/crearTipoEquipo", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO tipoequipo (nombre) VALUES ($1)",
            [nombre]
        );
        res.json({ success: true, msg: "Tipo de equipo creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerTiposEquiposRouter.get("/obtenerTiposEquipos", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM tipoequipo");
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

ObtenerTipoEquipoRouter.get("/obtenerTipoEquipo/:id", async (req, res) => {

    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM tipoequipo WHERE id=$1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Tipo de equipo no encontrado" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});

EditarTipoEquipoRouter.put("/editarTipoEquipo", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { id, nombre } = req.body;
    if (!id || !nombre) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }
    
    try {
        const result = await pool.query(
            "UPDATE tipoequipo SET nombre=$1 WHERE id=$2",
            [nombre, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Tipo de equipo no encontrado" });
        }
        res.json({ success: true, msg: "Tipo de equipo actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});
