import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";

interface ModalSolicitudPiezaProps {
    open: boolean;
    handleCloseModalSolicitudPieza: () => void;
    id: number | null;
    refetchSolicitudesPiezas: () => void;
}

function ModalAccionSolicitudPieza({ open, handleCloseModalSolicitudPieza, refetchSolicitudesPiezas, id }: ModalSolicitudPiezaProps) {
    const HOST = import.meta.env.VITE_HOST


    

    const [accion, setAccion] = useState<boolean>(false);

    const handleOnchange = (value: boolean) => {
        setAccion(value);
    }

    async function submitAutorizarSolicitudPieza(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const response = await fetch(HOST + "api/autorizarSolicitudPieza/", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "id": id, "autorizado": accion }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.msg);
                handleCloseModalSolicitudPieza();
                refetchSolicitudesPiezas();
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
                onClose={handleCloseModalSolicitudPieza}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitAutorizarSolicitudPieza}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ACCION SOBRE LA SOLICITUD DE PIEZA
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-autowidth-label">ACCION</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={accion}
                                onChange={(e) => handleOnchange(e.target.value as boolean)}
                                label="ACCION"
                            >
                                <MenuItem value={0} selected disabled>Seleccione un accion</MenuItem>
                                <MenuItem value={"true"}>AUTORIZAR</MenuItem>
                                <MenuItem value={"false"}>RECHAZAR</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ m: 1, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                ASIGNAR ACCION
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >
        </>
    );
}
export default ModalAccionSolicitudPieza;