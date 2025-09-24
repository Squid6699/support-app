import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Aula, Edificio, EquipoAula, Incidencia, Prioridad, Usuario } from "../../types";
import TextField from "@mui/material/TextField";
import { useSesion } from "../hook/useSesion";
import { style } from "../css/componentsStyle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useQuery } from "@tanstack/react-query";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Incidencias() {
    const { id, usuario } = useSesion();

    const HOST = import.meta.env.VITE_HOST

    const { data: edificios, isLoading: isLoadingEdificios } = useQuery<Edificio[]>({
        queryKey: ["Edificios"],
        queryFn: obtenerEdificiosPorEncargado,
    });

    const { data: aulas, isLoading: isLoadingAulas, refetch: refetchAulas } = useQuery<Aula[]>({
        queryKey: ["Aulas"],
        queryFn: obtenerAulasPorEdificio,
    });

    const { data: equipos, isLoading: isLoadingEquipos, refetch: refetchEquipos } = useQuery<EquipoAula[]>({
        queryKey: ["Equipos"],
        queryFn: obtenerEquiposPorAula,
    });

    const { data: prioridades, isLoading: isLoadingPrioridades } = useQuery<Prioridad[]>({
        queryKey: ["Prioridades"],
        queryFn: obtenerPrioridades,
    });

    const { data: tecnicos, isLoading: isLoadingTecnicos } = useQuery<Usuario[]>({
        queryKey: ["Tecnicos"],
        queryFn: obtenerTecnicos,
    });



    const [openModalIncidencia, setOpenModalIncidencia] = useState(false);

    const handleOpenModalIncidencia = () => {
        setOpenModalIncidencia(true);
    }

    const handleCloseModalIncidencia = () => {
        setOpenModalIncidencia(false);
    }

    const [incidenciaValue, setIncidenciaValue] = useState<Incidencia>({
        fecha: null,
        descripcion: '',
        usuario_id: id,
        tecnico_id: 0,
        equipo_id: 0,
        prioridad_id: 0
    });
    const [selectedEdificio, setSelectedEdificio] = useState<number>(0);
    const [selectedAula, setSelectedAula] = useState<number>(0);

    const [incidenciaError, setIncidenciaError] = useState({
        fecha: "",
        descripcion: "",
        tecnico_id: "",
        equipo_id: "",
        prioridad_id: ""
    });

    const handleValueErroresIncidencia = (newValue: any) => {
        setIncidenciaError({ ...incidenciaError, ...newValue });
    }

    const handleValueChangeIncidencia = (newValue: any) => {
        setIncidenciaValue({ ...incidenciaValue, ...newValue });
    }


    useEffect(() => {
        refetchAulas();
        setSelectedAula(0);
        handleValueChangeIncidencia({ equipo_id: 0 });

    }, [selectedEdificio]);

    useEffect(() => {
        refetchEquipos();
        handleValueChangeIncidencia({ equipo_id: 0 });
    }, [selectedAula]);


    // SACAR TODOS LOS TECNICOS
    async function obtenerTecnicos() {
        try {
            const response = await fetch(HOST + "api/obtenerTecnicos", {
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

    //SACAR EDIFICIOS DEL ENCARGADO
    async function obtenerEdificiosPorEncargado() {
        try {
            const response = await fetch(HOST + "api/obtenerEdificiosPorEncargado/" + id, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.data);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    //SACAR AULAS DEL EDIFICIO
    async function obtenerAulasPorEdificio() {
        try {
            const response = await fetch(HOST + "api/obtenerAulasPorEdificio/" + selectedEdificio, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.data);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    //SACAR EQUIPOS DEL AULA
    async function obtenerEquiposPorAula() {
        try {
            const response = await fetch(HOST + "api/obtenerEquiposPorAula/" + selectedAula, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.data);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    //SACAR PRIORIDADES
    async function obtenerPrioridades() {
        try {
            const response = await fetch(HOST + "api/obtenerPrioridades", {
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

    function submitIncidencia(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        handleValueErroresIncidencia({
            descripcion: "",
            tecnico_id: "",
            fecha: "",
            equipo_id: "",
            prioridad_id: "",
        });

        if (incidenciaValue.fecha === "") {
            handleValueErroresIncidencia({ fecha: "La fecha es requerida" });
            return;
        }

        if (incidenciaValue.descripcion === '') {
            handleValueErroresIncidencia({ descripcion: "La descripcion es requerida" });
            return;
        }

        if (incidenciaValue.tecnico_id === 0) {
            handleValueErroresIncidencia({ tecnico_id: "Seleccione un tecnico" });
            return;
        }

        if (incidenciaValue.equipo_id === 0) {
            handleValueErroresIncidencia({ equipo_id: "Seleccione un equipo" });
            return;
        }

        if (incidenciaValue.prioridad_id === 0) {
            handleValueErroresIncidencia({ prioridad_id: "Seleccione una prioridad" });
            return;
        }
    }

    return (

        <>
            <header>
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenModalIncidencia}>
                    CREAR
                </Button>
            </header>
            <Modal
                open={openModalIncidencia}
                onClose={handleCloseModalIncidencia}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitIncidencia}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Nueva incidencia
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha"
                                    value={incidenciaValue.fecha}
                                    onChange={(newValue) => handleValueChangeIncidencia({ fecha: newValue })}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: incidenciaError.fecha !== "",
                                            helperText: incidenciaError.fecha,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <TextField
                                id="outlined-multiline-static"
                                label="Descripcion"
                                multiline
                                rows={4}
                                defaultValue={incidenciaValue.descripcion}
                                onChange={(e) => handleValueChangeIncidencia({ descripcion: e.target.value })}
                                error={incidenciaError.descripcion !== ""}
                                helperText={incidenciaError.descripcion}
                            />
                        </Box>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <TextField id="outlined-basic" label="Encargado" variant="outlined" defaultValue={usuario} disabled />
                        </Box>



                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Tecnico</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={incidenciaValue.tecnico_id}
                                    onChange={(e) => handleValueChangeIncidencia({ tecnico_id: e.target.value })}
                                    autoWidth
                                    label="Tecnico"
                                >
                                    {isLoadingTecnicos ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un tecnico</MenuItem>
                                    {tecnicos ? tecnicos.map((tecnico) => (
                                        <MenuItem key={tecnico.id} value={tecnico.id}>{tecnico.nombre} - {tecnico.rol}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay técnicos disponibles</MenuItem>}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >

                            <FormControl sx={{ m: 1, width: '30%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Edificio</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={selectedEdificio}
                                    onChange={(e) => setSelectedEdificio(e.target.value)}
                                    autoWidth
                                    label="Edificio"
                                >
                                    {isLoadingEdificios ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un edificio</MenuItem>
                                    {edificios ? edificios.map((edificio) => (
                                        <MenuItem key={edificio.id} value={edificio.id}>{edificio.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay edificios disponibles</MenuItem>}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '30%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Aula</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={selectedAula}
                                    onChange={(e) => setSelectedAula(e.target.value)}
                                    autoWidth
                                    label="Aula"
                                >
                                    {isLoadingAulas ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un aula</MenuItem>
                                    {aulas ? aulas.map((aula) => (
                                        <MenuItem key={aula.id} value={aula.id}>{aula.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay aulas disponibles</MenuItem>}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '30%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Equipo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={incidenciaValue.equipo_id}
                                    onChange={(e) => handleValueChangeIncidencia({ equipo_id: e.target.value })}
                                    autoWidth
                                    label="Equipo"
                                >
                                    {isLoadingEquipos ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un equipo</MenuItem>
                                    {equipos ? equipos.map((equipo) => (
                                        <MenuItem key={equipo.id} value={equipo.id}>{equipo.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay equipos disponibles</MenuItem>}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Prioridad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={incidenciaValue.prioridad_id}
                                    onChange={(e) => handleValueChangeIncidencia({ prioridad_id: e.target.value })}
                                    autoWidth
                                    label="Prioridad"
                                >
                                    {isLoadingPrioridades ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione una prioridad</MenuItem>
                                    {prioridades ? prioridades.map((prioridad) => (
                                        <MenuItem key={prioridad.id} value={prioridad.id}>{prioridad.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay prioridades disponibles</MenuItem>}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                        >
                            <Button type="submit" variant="contained" className="boton" fullWidth >
                                Crear Incidencia
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >

        </>

    );
}
export default Incidencias;