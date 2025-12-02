import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState, useEffect } from "react";
import type { Pieza } from "../pages/Piezas";

interface ModalEditarPiezaProps {
    open: boolean;
    handleClose: () => void;
    refetchPiezas: () => void;
    pieza: Pieza | null;
}

function ModalEditarPieza({ open, handleClose, pieza, refetchPiezas }: ModalEditarPiezaProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState(0);

    useEffect(() => {
        if (pieza) {
            setNombre(pieza.nombre);
            setStock(pieza.stock);
        }
    }, [pieza]);

    async function submitEditarPieza(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nombre.trim() || stock < 0) {
            toast.error("TODOS LOS CAMPOS SON OBLIGATORIOS");
            return;
        }

        try {
            const response = await fetch(HOST + "api/editarPieza", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    id: pieza?.id,
                    nombre,
                    stock,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("PIEZA EDITADA CORRECTAMENTE");
                handleClose();
                refetchPiezas();
            } else {
                toast.error(data.msg || "ERROR AL EDITAR PIEZA");
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitEditarPieza}>
                <Typography variant="h6">EDITAR PIEZA</Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField label="NOMBRE" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TextField label="STOCK" type="number" fullWidth value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        GUARDAR CAMBIOS
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

export default ModalEditarPieza;
