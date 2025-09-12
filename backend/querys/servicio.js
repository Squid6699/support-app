import express from 'express';
import { pool } from '../database/db.js';

export const CrearServicioRouter = express.Router();
export const ObtenerServiciosRouter = express.Router();
export const ObtenerServicioRouter = express.Router();
export const EditarServicioRouter = express.Router();
export const EliminarServicioRouter = express.Router();

CrearEquipoRouter.post("/crearServicio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { nombre, descripcion, tecnico_id, horas} = req.body;
    if (!nombre|| !descripcion || tecnico_id|| horas)
        return res.status(400).json({ success: false, msg: "Faltan datos" });

    try {
        const result = await pool.query(
            "INSERT INTO servicio ( nombre, descripcion, tecnico_id, horas) VALUES ($1, $2, $3, $4)",
            [nombre, descripcion, tecnico_id,horas]
        );
        res.json({ success: true, msg: "Servicio creado correctamente", result: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error en DB" });
    }
});


ObtenerEquiposRouter.get("/obtenerServicios", async (req, res) => {
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

ObtenerEquipoRouter.get("/obtenerServicio/:id", async (req, res) => {

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


EditarEquipoRouter.put("/editarServicio", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend')
        return res.status(401).send('Unauthorized');

    const { id, nombre, descripcion, tecnico_id, horas } = req.body;
    if (!nombre || !descripcion || !tecnico_id|| !horas || !tipo_id)
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


EliminarEquipoRouter.delete("/eliminarServicio", async (req, res) => {
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

