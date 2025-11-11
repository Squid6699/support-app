import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import type { EquipoDetalles } from "../../types";


interface ModalCrearIncidenciaProps {
    open: boolean;
    handleClose: (value: boolean) => void;
    equipoId: number | null;
}

function ModalDetalleEquipo({ open, handleClose, equipoId }: ModalCrearIncidenciaProps) {
    const HOST = import.meta.env.VITE_HOST


    const { data: detallesEquipos, isLoading: isLoadingEquipos } = useQuery<EquipoDetalles[]>({
        queryKey: ["DetallesEquipo", equipoId],
        queryFn: obtenerDetallesEquipo,
    });


    //SACAR DETALLES DE EQUIPO
    async function obtenerDetallesEquipo() {
        try {
            const response = await fetch(HOST + "api/verDetallesEquipos/" + equipoId, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.result);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
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
                <Box sx={{
                    ...style,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        DETALLES EQUIPO
                    </Typography>

                    <Box
                        id="modal-modal-description"
                        sx={{
                            mt: 2,
                            maxHeight: '65vh',
                            overflowY: 'auto',
                            pr: 1
                        }}
                    >
                        {isLoadingEquipos ? (
                            <Typography>Cargando detalles del equipo...</Typography>
                        ) : detallesEquipos && detallesEquipos.length > 0 ? (
                            detallesEquipos.map((detalle) => (
                                <Box key={detalle.id}>

                                    {detalle.idincidente !== null ? (
                                        <>

                                            <Typography variant="body2">
                                                FECHA DE EQUIPO: {detalle.fechaequipo ? detalle.fechaequipo : "SIN FECHA"} <br />
                                            </Typography>
                                            <Typography variant="body1">
                                                {detalle.descripcionincidente ? detalle.descripcionincidente.toUpperCase() : "SIN INCIDENTE"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                TÉCNICO ASIGNADO: {detalle.nombretecnico ? detalle.nombretecnico.toUpperCase() : "NO ASIGNADO"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                PRIORIDAD: {detalle.prioridad ? detalle.prioridad.toUpperCase() : "SIN PRIORIDAD"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                ESTADO: {detalle.estadoincidencia ? detalle.estadoincidencia.toUpperCase() : "SIN ESTADO"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                NOMBRE SERVICIO: {detalle.nombreservicio ? detalle.nombreservicio.toUpperCase() : "SIN NOMBRE"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                DESCRIPCIÓN SERVICIO: {detalle.descripcionservicio ? detalle.descripcionservicio.toUpperCase() : "SIN DESCRIPCIÓN"} <br />
                                            </Typography>
                                            <Typography variant="body2">
                                                HORAS DE SERVICIO: {detalle.horasservicio !== null ? detalle.horasservicio : "SIN HORAS"} <br />
                                            </Typography>
                                            {/* <Typography variant="body2">
                                                CALIFICACIÓN DEL SERVICIO: {detalle.calificacionservicio !== 0 ? detalle.calificacionservicio : "SIN CALIFICACIÓN"} <br />
                                            </Typography> */}
                                            <hr />
                                        </>

                                    ) : (
                                        <Typography variant="body2">
                                            ESTE EQUIPO NO CUENTA CON INCIDENTES ASOCIADOS. <br />
                                        </Typography>

                                    )}

                                </Box>
                            ))
                        ) : (
                            <Typography>No se encontraron detalles del equipo.</Typography>
                        )}
                    </Box>
                </Box>
            </Modal>

        </>
    );
}
export default ModalDetalleEquipo;