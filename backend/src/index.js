import express from 'express';
import { middleware } from "../middleware/middleware.js";
const app = express();

//Uso de middlewares
app.use(middleware);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});