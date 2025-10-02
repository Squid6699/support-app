import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";


interface ModalEliminarIncidenciaProps {
    open: boolean;
    setOpenModalIncidencia: (value: boolean) => void;
    refetchIncidencias: () => void;
    id: number | null;
}

function ModalEliminarIncidencia({ open, setOpenModalIncidencia, refetchIncidencias, id }: ModalEliminarIncidenciaProps) {
    const HOST = import.meta.env.VITE_HOST

    const handleCloseModalIncidencia = () => {
        setOpenModalIncidencia(false);
    }

    async function submitIncidencia(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const response = await fetch(HOST + "api/eliminarIncidencia", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "id": id }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.msg);
                handleCloseModalIncidencia();
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }

        } catch (error) {
            toast.error("OCURRIO UN ERROR");
        }
    }

    return (
        <>

            <Modal
                open={open}
                onClose={handleCloseModalIncidencia}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitIncidencia}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ELIMINAR INCIDENCIA
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box sx={{ m: 2, width: '100%' }}>
                            <Typography id="modal-modal-title" component="h2">
                                ¿DESEA ELIMINAR LA INCIDENCIA #{id}?
                            </Typography>
                        </Box>

                        <Box sx={{ m: 1, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                ELIMINAR INCIDENCIA
                            </Button>
                        </Box>
                        <Box sx={{ m: 1, width: '100%' }}>
                            <Button variant="contained" className="boton-cancelar" fullWidth onClick={handleCloseModalIncidencia}>
                                CANCELAR
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >
        </>
    );
}
export default ModalEliminarIncidencia;