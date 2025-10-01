import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import { useSesion } from "../hook/useSesion";




function ModalCrearIncidencia({ open }) {
    const { id, usuario } = useSesion();

    async function submitIncidenciaEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        handleValueErroresIncidenciaEdit({
            descripcion: "",
            fecha: "",
            equipo_id: "",
            prioridad_id: "",
            edificio_id: "",
            aula_id: ""
        });

        if (incidenciaValueEdit.fecha === null) {
            handleValueErroresIncidenciaEdit({ fecha: "La fecha es requerida" });
            return;
        }

        if (incidenciaValueEdit.descripcion === '') {
            handleValueErroresIncidenciaEdit({ descripcion: "La descripcion es requerida" });
            return;
        }

        if (selectedEdificio === 0) {
            handleValueErroresIncidenciaEdit({ edificio_id: "Seleccione un edificio" });
            return;
        }

        if (selectedAula === 0) {
            handleValueErroresIncidenciaEdit({ aula_id: "Seleccione una aula" });
            return;
        }

        if (incidenciaValueEdit.equipo_id === 0) {
            handleValueErroresIncidenciaEdit({ equipo_id: "Seleccione un equipo" });
            return;
        }

        if (incidenciaValueEdit.prioridad_id === 0) {
            handleValueErroresIncidenciaEdit({ prioridad_id: "Seleccione una prioridad" });
            return;
        }

        try {
            const response = await fetch(HOST + "api/editarIncidencia", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "fecha": incidenciaValueEdit.fecha, "descripcion": incidenciaValueEdit.descripcion, "usuario_id": incidenciaValueEdit.usuario_id, "equipo_id": incidenciaValueEdit.equipo_id, "prioridad_id": incidenciaValueEdit.prioridad_id }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.msg);
                handleCloseModalIncidenciaEdit();
                setIncidenciaValueEdit({
                    fecha: null,
                    descripcion: '',
                    usuario_id: id,
                    equipo_id: 0,
                    prioridad_id: 0,
                });
                setSelectedEdificio(0);
                setSelectedAula(0);
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
                open={openModalIncidenciaEdit}
                onClose={handleCloseModalIncidenciaEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitIncidenciaEdit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        EDITAR INCIDENCIA
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box sx={{ m: 2, width: '100%' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disablePast
                                    label="Fecha"
                                    value={incidenciaValueEdit.fecha}
                                    onChange={(newValue) => handleValueChangeIncidenciaEdit({ fecha: newValue })}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: incidenciaErrorEdit.fecha !== "",
                                            helperText: incidenciaErrorEdit.fecha,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField
                                id="outlined-multiline-static"
                                label="Descripcion"
                                multiline
                                rows={4}
                                defaultValue={incidenciaValueEdit.descripcion}
                                onChange={(e) => handleValueChangeIncidenciaEdit({ descripcion: e.target.value })}
                                error={incidenciaErrorEdit.descripcion !== ""}
                                helperText={incidenciaErrorEdit.descripcion}
                                fullWidth
                            />
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField id="outlined-basic" label="Encargado" variant="outlined" defaultValue={usuario} disabled fullWidth />
                        </Box>

                        <Box
                            sx={{ m: 2, display: 'flex', gap: 2, flexDirection: 'row', flexWrap: 'nowrap' }}
                        >

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Edificio</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={selectedEdificio}
                                    onChange={(e) => setSelectedEdificio(e.target.value)}
                                    label="Edificio"

                                >
                                    {isLoadingEdificios ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un edificio</MenuItem>
                                    {edificios ? edificios.map((edificio) => (
                                        <MenuItem key={edificio.id} value={edificio.id}>{edificio.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay edificios disponibles</MenuItem>}
                                </Select>
                                <FormHelperText error>{incidenciaErrorEdit.edificio_id}</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Aula</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={selectedAula}
                                    onChange={(e) => setSelectedAula(e.target.value)}
                                    label="Aula"
                                >
                                    {isLoadingAulasEdit ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un aula</MenuItem>
                                    {aulasEdit ? aulasEdit.map((aula) => (
                                        <MenuItem key={aula.id} value={aula.id}>{aula.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay aulas disponibles</MenuItem>}
                                </Select>
                                <FormHelperText error>{incidenciaErrorEdit.aula_id}</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Equipo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={incidenciaValueEdit.equipo_id}
                                    onChange={(e) => handleValueChangeIncidenciaEdit({ equipo_id: e.target.value })}
                                    label="Equipo"
                                >
                                    {isLoadingEquiposEdit ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione un equipo</MenuItem>
                                    {equiposEdit ? equiposEdit.map((equipo) => (
                                        <MenuItem key={equipo.id} value={equipo.id}>{equipo.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay equipos disponibles</MenuItem>}
                                </Select>
                                <FormHelperText error>{incidenciaErrorEdit.equipo_id}</FormHelperText>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Prioridad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={incidenciaValueEdit.prioridad_id}
                                    onChange={(e) => handleValueChangeIncidenciaEdit({ prioridad_id: e.target.value })}
                                    label="Prioridad"
                                >
                                    {isLoadingPrioridades ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                    <MenuItem value={0} selected disabled>Seleccione una prioridad</MenuItem>
                                    {prioridades ? prioridades.map((prioridad) => (
                                        <MenuItem key={prioridad.id} value={prioridad.id}>{prioridad.nombre}</MenuItem>
                                    )) : <MenuItem key={0} value={0}>No hay prioridades disponibles</MenuItem>}
                                </Select>
                                <FormHelperText error>{incidenciaErrorEdit.prioridad_id}</FormHelperText>
                            </FormControl>
                        </Box>

                        <Box sx={{ m: 2, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                Editar Incidencia
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >
        </>
    );
}

export default ModalCrearIncidencia;