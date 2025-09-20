import express from 'express';
import { middleware } from "../middleware/middleware.js";

import { CrearUbicacionRouter, EditarUbicacionRouter, EliminarUbicacionRouter, ObtenerUbicacionesRouter, ObtenerUbicacionRouter } from '../querys/ubicacion.js';
import { CrearPersonaRouter, EditarPersonaRouter, EliminarPersonaRouter, ObtenerPersonasRouter, ObtenerPersonaRouter } from '../querys/personas.js';
import { CrearRolRouter, EditarRolRouter, EliminarRolRouter, ObtenerRolesRouter, ObtenerRolRouter } from '../querys/rol.js';
import { CrearPrioridadRouter, EditarPrioridadRouter, EliminarPrioridadRouter, ObtenerPrioridadesRouter, ObtenerPrioridadRouter } from '../querys/prioridad.js';
import { CrearEquipoRouter, EditarEquipoRouter, EliminarEquipoRouter, ObtenerEquiposRouter, ObtenerEquipoRouter, ObtenerEquiposEncargadoRouter } from '../querys/equipo.js';
import { CrearTipoEquipoRouter, EditarTipoEquipoRouter, EliminarTipoEquipoRouter, ObtenerTipoEquipoRouter, ObtenerTiposEquiposRouter } from '../querys/tipoEquipo.js';
import { CrearPiezaRouter, EditarPiezaRouter, EliminarPiezaRouter, ObtenerPiezaRouter, ObtenerPiezasRouter } from '../querys/pieza.js';
import { CrearMarcaRouter, EditarMarcaRouter, EliminarMarcaRouter, ObtenerMarcaRouter, ObtenerMarcasRouter } from '../querys/marca.js';
import { CalificarIncidenciaRouter, CrearIncidenciaRouter, EditarIncidenciaRouter, EliminarIncidenciaRouter, IniciarIncidenciaRouter, LiberarIncidenciaRouter, ObtenerIncidenciaRouter, ObtenerIncidenciasRouter, TerminarIncidenciaRouter, VerDetallesIncidenciaRouter,obtenerIncidenciasEncargadoRouter,ActualizarEstadoIncidenciaRouter, AsignarTecnico , AsignarTecnico , IncidenciasTecnicoRouter } from '../querys/incidente.js';
import { CrearServicioRouter, EditarServicioRouter, EliminarServicioRouter, ObtenerDetallesServicioRouter, ObtenerServicioRouter, ObtenerServiciosDeTecnicoRouter, ObtenerServiciosRouter } from '../querys/servicio.js';


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

app.use("/api/", CrearEquipoRouter);
app.use("/api/", ObtenerEquiposRouter);
app.use("/api/", ObtenerEquipoRouter);
app.use("/api/", EditarEquipoRouter);
app.use("/api/", EditarEquipoRouter);

app.use("/api/", CrearServicioRouter);
app.use("/api/", ObtenerServiciosRouter);
app.use("/api/", ObtenerServicioRouter);
app.use("/api/", EditarServicioRouter);
app.use("/api/", EliminarServicioRouter);


app.use("/api/", ObtenerEquiposEncargadoRouter);


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
app.use("/api/",obtenerIncidenciasEncargadoRouter);

// Ruta para que el encargado de edificio acepte o rechace una incidencia.
app.use("/api/",ActualizarEstadoIncidenciaRouter);

// Ruta para que el administrador asigne un técnico a una incidencia
app.use("/api/",AsignarTecnico);

//-Ruta para que el tecnico pueda ver sus incidencias asignadas. 
app.use("/api/",IncidenciasTecnicoRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});