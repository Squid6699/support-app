import express from "express";

export const CrearPiezaRouter = express.Router();
export const ObtenerPiezasRouter = express.Router();
export const ObtenerPiezaRouter = express.Router();
export const EditarPiezaRouter = express.Router();
export const EliminarPiezaRouter = express.Router();

CrearPiezaRouter.post("/crearPieza", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend'){
        return res.status(401).send('Unauthorized');
    }

    const { nombre, fecha, marca_id } = req.body;

    if (!nombre || !fecha || !marca_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO pieza (nombre, fecha, marca_id) VALUES ($1, $2, $3)",
            [nombre, fecha, marca_id]
        );

        if (result.rows.length === 0) {
            return res.status(500).json({ success: false, msg: "Error al crear pieza" });
        }

        res.json({ success: true, msg: "Pieza creada correctamente", result: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    } 
});

ObtenerPiezasRouter.get("/obtenerPiezas", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];

    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM pieza");
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

    const { id, nombre, fecha, marca_id } = req.body;
    if (!id || !nombre || !fecha || !marca_id) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }
    try {
        const result = await pool.query(
            "UPDATE pieza SET nombre = $1, fecha = $2, marca_id = $3 WHERE id = $4",
            [nombre, fecha, marca_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Pieza no encontrada" });
        }
        res.json({ success: true, msg: "Pieza actualizada correctamente", result: result.rows[0] });
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
        res.json({ success: true, msg: "Pieza eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});
