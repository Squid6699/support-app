import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState, useEffect } from "react";
import type { Pieza } from "../pages/Piezas";

interface ModalEditarStockProps {
    open: boolean;
    handleClose: () => void;
    pieza: Pieza | null;
    refetchPiezas: () => void;
}

function ModalEditarStock({ open, handleClose, pieza, refetchPiezas }: ModalEditarStockProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [stock, setStock] = useState<number | "">("");

    useEffect(() => {
        if (pieza) {
            setStock(pieza.stock);
        }
    }, [pieza]);

    async function submitStock(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (stock === "" || Number(stock) < 0) {
            toast.error("INGRESE UN STOCK VÁLIDO");
            return;
        }

        try {
            const response = await fetch(HOST + "api/editarStockPieza", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    id: pieza?.id,
                    stock: Number(stock),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("STOCK ACTUALIZADO");
                handleClose();
                refetchPiezas();
            } else {
                toast.error(data.msg || "ERROR AL ACTUALIZAR STOCK");
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitStock}>
                <Typography variant="h6">EDITAR STOCK</Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="STOCK DISPONIBLE"
                        type="number"
                        fullWidth
                        value={stock}
                        onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    />
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

export default ModalEditarStock;
