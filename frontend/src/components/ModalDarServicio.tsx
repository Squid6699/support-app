import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import { useSesion } from "../hook/useSesion";
import type { DarServicio } from "../../types";
import { useState } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";


interface ModalDarServiciosProps {
    open: boolean;
    incidenciaSeleccionada: number | null;
    handleModalClose: () => void;
    refetchIncidencias: () => void;
}

function ModalDarServicio({ open, incidenciaSeleccionada, handleModalClose, refetchIncidencias }: ModalDarServiciosProps) {
    const { id, usuario } = useSesion();
    const HOST = import.meta.env.VITE_HOST


    const [servicioValue, setServicioValue] = useState<DarServicio>({
        nombre: '',
        descripcion: '',
        horas: 0,
        encargado_id: id
    });

    const handleCloseModalIncidencia = () => {
        handleModalClose();
        setServicioValue({
            nombre: '',
            descripcion: '',
            horas: 0,
            encargado_id: id
        });
    }

    const [servicioError, setServicioError] = useState({
        nombre: '',
        descripcion: '',
        horas: '',
        encargado_id: id
    });

    const handleValueErroresServicio = (newValue: any) => {
        setServicioError({ ...servicioError, ...newValue });
    }

    const handleValueChangeServicio = (newValue: any) => {
        setServicioValue({ ...servicioValue, ...newValue });
    }

    async function submitIncidencia(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        handleValueErroresServicio({
            descripcion: "",
            fecha: "",
            equipo_id: "",
            prioridad_id: "",
            edificio_id: "",
            aula_id: ""
        });

        if (servicioValue.nombre === null) {
            handleValueErroresServicio({ nombre: "El nombre es requerido" });
            return;
        }

        if (servicioValue.descripcion === '') {
            handleValueErroresServicio({ descripcion: "La descripcion es requerida" });
            return;
        }

        if (servicioValue.horas === 0) {
            handleValueErroresServicio({ horas: "Las horas son requeridas" });
            return;
        }


        try {
            const response = await fetch(HOST + "api/crearServicio", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "id_incidencia": incidenciaSeleccionada, "nombre": servicioValue.nombre, "descripcion": servicioValue.descripcion, "horas": servicioValue.horas, "tecnico_id": servicioValue.encargado_id }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.msg);
                handleCloseModalIncidencia();
                setServicioValue({
                    nombre: '',
                    descripcion: '',
                    horas: 0,
                    encargado_id: id,
                });
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
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitIncidencia}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        DAR SERVICIO A INCIDENCIA
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField
                                id="outlined-multiline-static"
                                label="Nombre"
                                defaultValue={servicioValue.nombre}
                                onChange={(e) => handleValueChangeServicio({ nombre: e.target.value })}
                                error={servicioError.nombre !== ""}
                                helperText={servicioError.nombre}
                                fullWidth
                            />
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField
                                id="outlined-multiline-static"
                                label="Descripcion"
                                multiline
                                rows={4}
                                defaultValue={servicioValue.descripcion}
                                onChange={(e) => handleValueChangeServicio({ descripcion: e.target.value })}
                                error={servicioError.descripcion !== ""}
                                helperText={servicioError.descripcion}
                                fullWidth
                            />
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField id="outlined-basic" label="Encargado" variant="outlined" defaultValue={usuario} disabled fullWidth />
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField
                                id="outlined-multiline-static"
                                label="Horas"
                                defaultValue={servicioValue.horas}
                                onChange={(e) => handleValueChangeServicio({ horas: e.target.value })}
                                error={servicioError.horas !== ""}
                                helperText={servicioError.horas}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ m: 2, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                Dar Servicio
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >
        </>
    );
}
export default ModalDarServicio;