import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState } from "react";

interface ModalCrearEdificioProps {
    open: boolean;
    handleClose: () => void;
    refetchEdificios: () => void;
}

function ModalCrearEdificio({ open, handleClose, refetchEdificios }: ModalCrearEdificioProps) {
    const HOST = import.meta.env.VITE_HOST;
    const [nombre, setNombre] = useState("");

    async function submitEdificio(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error("Introduce un nombre");
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearEdificio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ nombre }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                setNombre("");
                handleClose();
                refetchEdificios();
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
        >
            <Box sx={style} component="form" onSubmit={submitEdificio}>
                <Typography id="modal-modal-title" variant="h6">
                    CREAR EDIFICIO
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Nombre del edificio"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        CREAR
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

export default ModalCrearEdificio;
