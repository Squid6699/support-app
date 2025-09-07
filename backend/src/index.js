import express from 'express';
import { middleware } from "../middleware/middleware.js";
const app = express();

//Uso de middlewares
app.use(middleware);


//IMPORTACION RUTAS EDIFICIO
import { CrearEdificioRouter } from '../querys/edificio.js';
app.use("/api/", CrearEdificioRouter);





app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});