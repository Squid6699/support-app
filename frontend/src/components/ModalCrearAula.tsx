import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState } from "react";
import type { EdificioUbicacion } from "../../types";

interface ModalCrearAulaProps {
    open: boolean;
    handleClose: () => void;
    edificios: EdificioUbicacion[];
    refetchUbicaciones: () => void;
}

function ModalCrearAula({ open, handleClose, edificios, refetchUbicaciones }: ModalCrearAulaProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [edificioId, setEdificioId] = useState<number | "">("");

    async function submitAula(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error("INTRODUCE UN NOMBRE PARA EL AULA");
            return;
        }

        if (!edificioId) {
            toast.error("SELECCIONA UN EDIFICIO");
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearAula", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    nombre,
                    edificio_id: edificioId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("AULA CREADA CORRECTAMENTE");

                setNombre("");
                setEdificioId("");

                handleClose();
                refetchUbicaciones();
            } else {
                toast.error(data.msg || "ERROR AL CREAR AULA");
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitAula}>
                <Typography variant="h6">CREAR AULA</Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="NOMBRE DEL AULA"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-edificio-label">EDIFICIO</InputLabel>
                        <Select
                            labelId="select-edificio-label"
                            label="EDIFICIO"
                            value={edificioId}
                            onChange={(e) => setEdificioId(Number(e.target.value))}
                        >
                            {edificios.map((e) => (
                                <MenuItem key={e.edificio_id} value={e.edificio_id}>
                                    {e.edificio_nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        CREAR AULA
                    </Button>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Button
                        variant="contained"
                        className="boton-cancelar"
                        fullWidth
                        onClick={handleClose}
                    >
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalCrearAula;
