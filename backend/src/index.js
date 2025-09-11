import express from 'express';
import { middleware } from "../middleware/middleware.js";

import { CrearUbicacionRouter, EditarUbicacionRouter, EliminarUbicacionRouter, ObtenerUbicacionesRouter, ObtenerUbicacionRouter } from '../querys/ubicacion.js';
import { CrearPersonaRouter, EditarPersonaRouter, EliminarPersonaRouter, ObtenerPersonasRouter, ObtenerPersonaRouter } from '../querys/personas.js';
import { CrearRolRouter, EditarRolRouter, EliminarRolRouter, ObtenerRolesRouter, ObtenerRolRouter } from '../querys/rol.js';
import { CrearPrioridadRouter, EditarPrioridadRouter, EliminarPrioridadRouter, ObtenerPrioridadesRouter, ObtenerPrioridadRouter } from '../querys/prioridad.js';
import { CrearEquipoRouter, EditarEquipoRouter, EliminarEquipoRouter, ObtenerEquiposRouter, ObtenerEquipoRouter } from '../querys/equipo.js';
import { CrearTipoEquipoRouter, EditarTipoEquipoRouter, EliminarTipoEquipoRouter, ObtenerTipoEquipoRouter, ObtenerTiposEquiposRouter } from '../querys/tipoEquipo.js';
import { CrearPiezaRouter, EditarPiezaRouter, EliminarPiezaRouter, ObtenerPiezaRouter, ObtenerPiezasRouter } from '../querys/pieza.js';
import { CrearMarcaRouter, EditarMarcaRouter, EliminarMarcaRouter, ObtenerMarcaRouter, ObtenerMarcasRouter } from '../querys/marca.js';
import { CrearIncidenciaRouter, EditarIncidenciaRouter, EliminarIncidenciaRouter, ObtenerIncidenciaRouter, ObtenerIncidenciasRouter } from '../querys/incidente.js';

const app = express();

//Uso de middlewares
app.use(middleware);

app.use("/api/", CrearUbicacionRouter);
app.use("/api/", ObtenerUbicacionesRouter);
app.use("/api/", ObtenerUbicacionRouter);
app.use("/api/", EditarUbicacionRouter);
app.use("/api/", EliminarUbicacionRouter);

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

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});