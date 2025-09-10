import express from 'express';
import { middleware } from "../middleware/middleware.js";

//IMPORTACION RUTAS UBICACION
import { CrearUbicacionRouter, EditarUbicacionRouter, EliminarUbicacionRouter, ObtenerUbicacionesRouter, ObtenerUbicacionRouter } from '../querys/ubicacion.js';

const app = express();

//Uso de middlewares
app.use(middleware);



app.use("/api/", CrearUbicacionRouter);
app.use("/api/", ObtenerUbicacionesRouter);
app.use("/api/", ObtenerUbicacionRouter);
app.use("/api/", EditarUbicacionRouter);
app.use("/api/", EliminarUbicacionRouter);





app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});