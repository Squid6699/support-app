import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState } from "react";

interface ModalCrearPiezaProps {
    open: boolean;
    handleClose: () => void;
    refetchPiezas: () => void;
}

function ModalCrearPieza({ open, handleClose, refetchPiezas }: ModalCrearPiezaProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState(0);

    async function submitPieza(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error("INTRODUCE UN NOMBRE");
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearPieza", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ nombre, stock }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("PIEZA CREADA");
                setNombre("");
                setStock(0);
                handleClose();
                refetchPiezas();
            } else {
                toast.error(data.msg || "ERROR AL CREAR PIEZA");
            }
        } catch {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitPieza}>
                <Typography variant="h6">CREAR PIEZA</Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="NOMBRE"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        type="number"
                        fullWidth
                        label="STOCK INICIAL"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                    />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button type="submit" className="boton" variant="contained" fullWidth>
                        CREAR PIEZA
                    </Button>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Button variant="contained" className="boton-cancelar" fullWidth onClick={handleClose}>
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalCrearPieza;
