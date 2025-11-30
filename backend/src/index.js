import express from 'express';
import { middleware } from "../middleware/middleware.js";
import jwt from "jsonwebtoken";

import { CrearPersonaRouter, EditarPersonaRouter, EliminarPersonaRouter, ObtenerPersonasRouter, ObtenerPersonaRouter, ObtenerTecnicosRouter, ObtenerEncargadosRouter } from '../querys/personas.js';
import { CrearRolRouter, EditarRolRouter, EliminarRolRouter, ObtenerRolesRouter, ObtenerRolRouter } from '../querys/rol.js';
import { CrearPrioridadRouter, EditarPrioridadRouter, EliminarPrioridadRouter, ObtenerPrioridadesRouter, ObtenerPrioridadRouter } from '../querys/prioridad.js';
import { CrearEquipoRouter, EditarEquipoRouter, EliminarEquipoRouter, ObtenerEquiposRouter, ObtenerEquipoRouter, ObtenerEquiposEncargadoRouter, ObtenerEquiposPorAulaRouter, ObtenerDetallesEquiposRouter, ObtenerEquiposPorAulaIncidenciaRouter } from '../querys/equipo.js';
import { CrearTipoEquipoRouter, EditarTipoEquipoRouter, EliminarTipoEquipoRouter, ObtenerTipoEquipoRouter, ObtenerTiposEquiposRouter } from '../querys/tipoEquipo.js';
import { CrearPiezaRouter, EditarPiezaRouter, EliminarPiezaRouter, ObtenerPiezaRouter, ObtenerPiezasRouter } from '../querys/pieza.js';
import { CrearMarcaRouter, EditarMarcaRouter, EliminarMarcaRouter, ObtenerMarcaRouter, ObtenerMarcasRouter } from '../querys/marca.js';
import { CalificarIncidenciaRouter, CrearIncidenciaRouter, EditarIncidenciaRouter, EliminarIncidenciaRouter, IniciarIncidenciaRouter, LiberarIncidenciaRouter, ObtenerIncidenciaRouter, ObtenerIncidenciasRouter, TerminarIncidenciaRouter, VerDetallesIncidenciaRouter, ObtenerIncidenciasEncargadoRouter, ActualizarEstadoIncidenciaRouter, AsignarTecnico, IncidenciasTecnicoRouter, ObtenerIncidenciasLiberadasRouter, ObtenerIncidenciasAdminRouter, ObtenerIncidenciasLiberadasAdminRouter, AsignarPrioridadRouter } from '../querys/incidente.js';
import { CrearServicioRouter, EditarServicioRouter, EliminarServicioRouter, ObtenerDetallesServicioRouter, ObtenerServicioRouter, ObtenerServiciosDeEquiposAdminRouter, ObtenerServiciosDeEquiposRouter, ObtenerServiciosDeTecnicoRouter, ObtenerServiciosRouter } from '../querys/servicio.js';
import { userAuth } from '../querys/Auth.js';
import { AsignarEncargadoRouter, CrearAulaRouter, CrearEdificioRouter, EditarAulaRouter, EditarEdificioRouter, EliminarAulaRouter, EliminarEdificioRouter, ObtenerAulasPorEdificioRouter, ObtenerAulasRouter, ObtenerEdificiosConAulasYEquiposRouter, ObtenerEdificiosPorEncargadoRouter, ObtenerEdificiosRouter } from '../querys/ubicacion.js';
import 'dotenv/config';

const app = express();

//Uso de middlewares
app.use(middleware);

app.use("/api/", CrearEdificioRouter);
app.use("/api/", CrearAulaRouter);
app.use("/api/", ObtenerEdificiosRouter);
app.use("/api/", ObtenerAulasRouter);
app.use("/api/", EditarEdificioRouter);
app.use("/api/", EditarAulaRouter);
app.use("/api/", EliminarEdificioRouter);
app.use("/api/", EliminarAulaRouter);
app.use("/api/", ObtenerAulasPorEdificioRouter);


app.use("/api/", CrearPersonaRouter);
app.use("/api/", ObtenerPersonasRouter);
app.use("/api/", ObtenerPersonaRouter);
app.use("/api/", EditarPersonaRouter);
app.use("/api/", EliminarPersonaRouter);

app.use("/api/", CrearRolRouter);
app.use("/api/", ObtenerRolesRouter);
app.use("/api/", ObtenerRolRouter);
app.use("/api/", EditarRolRouter);
app.use("/api/", EliminarRolRouter);

app.use("/api/", CrearPrioridadRouter);
app.use("/api/", ObtenerPrioridadesRouter);
app.use("/api/", ObtenerPrioridadRouter);
app.use("/api/", EditarPrioridadRouter);
app.use("/api/", EliminarPrioridadRouter);

app.use("/api/", CrearEquipoRouter);
app.use("/api/", ObtenerEquiposRouter);
app.use("/api/", ObtenerEquipoRouter);
app.use("/api/", EditarEquipoRouter);
app.use("/api/", EliminarEquipoRouter);

app.use("/api/", CrearTipoEquipoRouter);
app.use("/api/", ObtenerTiposEquiposRouter);
app.use("/api/", ObtenerTipoEquipoRouter);
app.use("/api/", EditarTipoEquipoRouter);
app.use("/api/", EliminarTipoEquipoRouter);

app.use("/api/", CrearPiezaRouter);
app.use("/api/", ObtenerPiezasRouter);
app.use("/api/", ObtenerPiezaRouter);
app.use("/api/", EditarPiezaRouter);
app.use("/api/", EliminarPiezaRouter);

app.use("/api/", CrearMarcaRouter);
app.use("/api/", EditarMarcaRouter);
app.use("/api/", ObtenerMarcasRouter);
app.use("/api/", ObtenerMarcaRouter);
app.use("/api/", EliminarMarcaRouter);

app.use("/api/", CrearIncidenciaRouter);
app.use("/api/", ObtenerIncidenciasRouter);
app.use("/api/", ObtenerIncidenciaRouter);
app.use("/api/", EditarIncidenciaRouter);
app.use("/api/", EliminarIncidenciaRouter);
app.use("/api/", ObtenerIncidenciasLiberadasRouter);

app.use("/api/", CrearServicioRouter);
app.use("/api/", ObtenerServiciosRouter);
app.use("/api/", ObtenerServicioRouter);
app.use("/api/", EditarServicioRouter);
app.use("/api/", EliminarServicioRouter);


app.use("/api/", ObtenerEquiposEncargadoRouter);
app.use("/api/", ObtenerDetallesEquiposRouter);

app.use("/api/", ObtenerServiciosDeEquiposRouter);


//Ruta para que el tecnico pueda ver detalles de la incidencia asignada (Nombre, ubicacion, marca, tipo, piezas, incidencias anteriores). // tabla incidencia
app.use("/api/", VerDetallesIncidenciaRouter);

//Ruta para que el tecnico pueda ver sus servicios dados.
app.use("/api/", ObtenerServiciosDeTecnicoRouter);

//Ruta para que el tecnico pueda ver los detalles de los servicios dados.
app.use("/api/", ObtenerDetallesServicioRouter);

//Ruta para que el tecnico pueda iniciar una incidencia.
app.use("/api/", IniciarIncidenciaRouter);

//Ruta para que el tecnico pueda terminar una incidencia.
app.use("/api/", TerminarIncidenciaRouter);

//Ruta para que el encargado pueda dar una calificacion a la incidencia.
app.use("/api/", CalificarIncidenciaRouter);

//Ruta para que el encargado de edificio pueda liberar las incidencias en estado terminado.
app.use("/api/", LiberarIncidenciaRouter);

// Ruta para que el encargado de edificio pueda ver sus incidencias.
app.use("/api/", ObtenerIncidenciasEncargadoRouter);

// Ruta para que el encargado de edificio acepte o srechace una incidencia.
app.use("/api/", ActualizarEstadoIncidenciaRouter);

// Ruta para que el administrador asigne un técnico a una incidencia
app.use("/api/", AsignarTecnico);

//Ruta para que el tecnico pueda ver sus incidencias asignadas. 
app.use("/api/", IncidenciasTecnicoRouter); 

//Ruta para que el administrador pueda ver todas las incidencias
app.use("/api/", ObtenerIncidenciasAdminRouter);

//Ruta para que el administrador pueda ver todas las incidencias liberadas
app.use("/api/", ObtenerIncidenciasLiberadasAdminRouter);

// Ruta para que el administrador pueda ver los servicios de todos los equipos
app.use("/api/", ObtenerServiciosDeEquiposAdminRouter);


app.use("/api/", userAuth);

//Ruta para obtener a los tecnicos
app.use("/api/", ObtenerTecnicosRouter);

//Ruta para obtener los edificios del encargado
app.use("/api/", ObtenerEdificiosPorEncargadoRouter);

//Ruta para obtener equipos por aula
app.use("/api/", ObtenerEquiposPorAulaRouter);

//Ruta para obtener equipos por aula
app.use("/api/", ObtenerEquiposPorAulaIncidenciaRouter);

// Ruta para obtener los edificios con sus aulas y los equipos de cada aula
app.use("/api/", ObtenerEdificiosConAulasYEquiposRouter);

//Ruta para asignar encargado a un edificio
app.use("/api/", AsignarEncargadoRouter);

// Ruta para obtener a todos los encargados de edificios
app.use("/api/", ObtenerEncargadosRouter);

//Ruta para que el administrador asigne la prioridad a una incidencia.
app.use("/api/", AsignarPrioridadRouter);




app.post("/api/", (req, res) => {
    const token = req.cookies.sesion;

    if (!token) {
        return res.json({ success: false, msg: "TOKEN INVALIDO." })
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        res.json({ success: true, id: verified.id, usuario: verified.usuario, correo: verified.correo, celular: verified.celular, rol: verified.rol });

    } catch (error) {
        return res.json({ success: false, msg: "TOKEN EXPIRADO." })
    }
})

app.get("/api/logout", async (req, res) => {
    const customHeader = req.headers['x-custom-header'];

    if (customHeader !== 'my-frontend-identifier') {
        return res.status(401).send('Unauthorized');
    }

    try {
        res.clearCookie('sesion', { path: '/' });
        return res.json({ success: true });
    } catch (err) {
        return res.json({ error: "OCURRIO UN ERROR AL CERRAR SESION" })
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});