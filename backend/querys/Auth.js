import express from "express";
import { pool } from '../database/db.js';
import jwt from "jsonwebtoken";

export const userAuth = express.Router();

userAuth.post("/auth/login", async (req, res) => {
    const customHeader = req.headers['x-frontend-header'];
    if (customHeader !== 'frontend') {
        return res.status(401).send('Unauthorized');
    }

    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
        return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    try {
        const result = await pool.query(`
            SELECT P.nombre AS nombreUsuario, P.correo AS correoUsuario, P.celular AS celularUsuario, R.nombre AS nombreRol
            FROM persona P
            INNER JOIN rol R ON P.rol_id = R.id
            WHERE correo=$1 AND contraseña=$2`
            , [correo, contrasena]);


        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, msg: "CONTRASEÑA Y/O CORREO INCORRECTO" });
        }
        const user = result.rows[0];

        const token = jwt.sign({ usuario: user.nombreusuario, correo: user.correousuario, celular: user.celularusuario, rol: user.nombrerol }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRED,
        });
        res.cookie('sesion', token, { httpOnly: true, secure: false });

        res.json({ success: true, usuario: user.nombreusuario, correo: user.correousuario, celular: user.celularusuario, rol: user.nombrerol });

    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error en el servidor" });
    }
});