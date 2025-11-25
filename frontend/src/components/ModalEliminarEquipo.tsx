import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

interface ModalEliminarEquipoProps {
    open: boolean;
    setOpenModalEliminar: (value: boolean) => void;
    refetchEquipos: () => void;
    id: number | null;
    nombre: string | null;
}

function ModalEliminarEquipo({
    open,
    setOpenModalEliminar,
    refetchEquipos,
    id,
    nombre
}: ModalEliminarEquipoProps) {

    const HOST = import.meta.env.VITE_HOST;

    const handleClose = () => {
        setOpenModalEliminar(false);
    };

    async function submitEliminar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(HOST + `api/eliminarEquipo`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                handleClose();
                refetchEquipos();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitEliminar}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ELIMINAR EQUIPO
                    </Typography>

                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box sx={{ m: 2, width: "100%" }}>
                            <Typography>
                                ¿DESEA ELIMINAR EL EQUIPO:
                                <strong> {nombre}</strong>?
                            </Typography>
                        </Box>

                        <Box sx={{ m: 1, width: "100%" }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                ELIMINAR EQUIPO
                            </Button>
                        </Box>

                        <Box sx={{ m: 1, width: "100%" }}>
                            <Button variant="contained" className="boton-cancelar" fullWidth onClick={handleClose}>
                                CANCELAR
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default ModalEliminarEquipo;
