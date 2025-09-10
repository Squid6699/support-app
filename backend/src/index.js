import express from 'express';
import { middleware } from "../middleware/middleware.js";

//IMPORTACION RUTAS UBICACION
import { CrearUbicacionRouter, EditarUbicacionRouter, EliminarUbicacionRouter, ObtenerUbicacionesRouter, ObtenerUbicacionRouter } from '../querys/ubicacion.js';
import { CrearPersonaRouter,EditarPersonaRouter,EliminarPersonaRouter,ObtenerPersonasRouter,ObtenerPersonaRouter } from '../querys/personas.js';
import { CrearRolRouter,EditarRolRouter,EliminarRolRouter,ObtenerRolesRouter,ObtenerRolRouter } from '../querys/rol.js';
import { CrearPrioridadRouter,EditarPrioridadRouter,EliminarPrioridadRouter,ObtenerPrioridadesRouter,ObtenerPrioridadRouter} from '../querys/prioridad.js';
import { CrearEquipoRouter,EditarEquipoRouter,EliminarEquipoRouter,ObtenerEquiposRouter,ObtenerEquipoRouter } from '../querys/equipo.js';

const app = express();

//Uso de middlewares
app.use(middleware);

export const CrearEquipoRouter = express.Router();
export const ObtenerEquiposRouter = express.Router();
export const ObtenerEquipoRouter = express.Router();
export const EditarEquipoRouter = express.Router();
export const EliminarEquipoRouter = express.Router();


app.use("/api/", CrearUbicacionRouter);
app.use("/api/", ObtenerUbicacionesRouter);
app.use("/api/", ObtenerUbicacionRouter);
app.use("/api/", EditarUbicacionRouter);
app.use("/api/", EliminarUbicacionRouter);

app.use("/api/" , CrearPersonaRouter);
app.use("/api/", ObtenerPersonasRouter);
app.use("/api/", ObtenerPersonaRouter);
app.use("/api/", EditarPersonaRouter);
app.use("/api/", EliminarPersonaRouter);

app.use("/api/" , CrearRolRouter);
app.use("/api/",ObtenerRolesRouter);
app.use("/api/", ObtenerRolRouter);
app.use("/api/", EditarRolRouter);
app.use("/api/", EliminarRolRouter);

app.use("/api/" , CrearPrioridadRouter);
app.use("/api/",ObtenerPrioridadesRouter);
app.use("/api/", ObtenerPrioridadRouter);
app.use("/api/", EditarPrioridadRouter);
app.use("/api/", EliminarPrioridadRouter);

app.use("/api/" , CrearEquipoRouter);
app.use("/api/", ObtenerEquiposRouterr);
app.use("/api/", ObtenerEquipoRouter);
app.use("/api/", EditarEquipoRouter);
app.use("/api/", EliminarEquipoRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});