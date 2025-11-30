import express from "express";

export const CrearMarcaRouter = express.Router();
export const ObtenerMarcasRouter = express.Router();
export const ObtenerMarcaRouter = express.Router();
export const EditarMarcaRouter = express.Router();
export const EliminarMarcaRouter = express.Router();

CrearMarcaRouter.post("/crearMarca", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend'){
        return res.status(401).send('Unauthorized');
    }
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO marca (nombre) VALUES ($1)",
            [nombre]
        );

        if (result.rows.length === 0) {
            return res.status(500).json({ success: false, msg: "Error al crear marca" });
        }

        res.json({ success: true, msg: "Marca creada correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerMarcasRouter.get("/obtenerMarcas", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await pool.query("SELECT * FROM marca");
        res.json({ success: true, result: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

ObtenerMarcaRouter.get("/obtenerMarca/:id", async (req, res) => {
    const customHeader = req.headers['x-frontend-header']; 
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }  
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM marca WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Marca no encontrada" });
        }
        res.json({ success: true, result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EditarMarcaRouter.put("/editarMarca", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }
    const { id, nombre } = req.body;

    if (!id || !nombre) {
        return res.status(400).json({ success: false, msg: "FALTAN DATOS" });
    }

    try {
        const result = await pool.query(
            "UPDATE marca SET nombre = $1 WHERE id = $2",
            [nombre, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Marca no encontrada" });
        }
        res.json({ success: true, msg: "Marca actualizada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});

EliminarMarcaRouter.delete("/eliminarMarca", async (req, res) => {
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
            "DELETE FROM marca WHERE id = $1",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, msg: "Marca no encontrada" });
        }
        res.json({ success: true, msg: "Marca eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "OCURRIO UN ERROR" });
    }
});
