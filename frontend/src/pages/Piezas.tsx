// NO TERMINADO, AQUI ESTARAN LAS PIEZAS DISPONBILES Y SE PODRA AGREGAR PIEZAS, ELIMINAR O EDITAR

import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalCrearPieza from "../components/ModalCrearPieza";
import ModalEliminarPieza from "../components/ModalEliminarPieza";
import ModalEditarPieza from "../components/ModalEditarPieza";
import ModalEditarStock from "../components/ModalEditarStockPiezas";

export interface Pieza {
    id: number;
    nombre: string;
    stock: number;
}

function Piezas() {
    const HOST = import.meta.env.VITE_HOST;

    const { data: piezas, isLoading: isLoadingPiezas, refetch: refetchPiezas } = useQuery<Pieza[]>({
        queryKey: ["Piezas"],
        queryFn: obtenerPiezas,
    });

    async function obtenerPiezas() {
        try {
            const response = await fetch(HOST + "api/obtenerPiezas", {
                method: "GET",
                headers: {
                    "x-frontend-header": "frontend",
                },
            });
            const data = await response.json();
            if (data.success) return data.result;
            return [];
        } catch (error) {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    const [openModalCrearPieza, setOpenModalCrearPieza] = useState(false);

    const handleOpenCrearPieza = () => setOpenModalCrearPieza(true);
    const handleCloseCrearPieza = () => setOpenModalCrearPieza(false);

    const [openModalEliminarPieza, setOpenModalEliminarPieza] = useState(false);
    const [selectedPiezaId, setSelectedPiezaId] = useState<number | null>(null);

    const handleOpenEliminarPieza = (id: number) => {
        setSelectedPiezaId(id);
        setOpenModalEliminarPieza(true);
    };

    const handleCloseEliminarPieza = () => {
        setSelectedPiezaId(null);
        setOpenModalEliminarPieza(false);
    };

    const [openModalEditarPieza, setOpenModalEditarPieza] = useState(false);
    const [selectedPieza, setSelectedPieza] = useState<Pieza | null>(null);

    const handleOpenEditarPieza = (pieza: Pieza) => {
        setSelectedPieza(pieza);
        setOpenModalEditarPieza(true);
    };

    const handleCloseEditarPieza = () => {
        setSelectedPieza(null);
        setOpenModalEditarPieza(false);
    };

    const [openModalEditarStock, setOpenModalEditarStock] = useState(false);

    const handleOpenEditarStock = (pieza: Pieza) => {
        setSelectedPieza(pieza);
        setOpenModalEditarStock(true);
    };

    const handleCloseEditarStock = () => {
        setSelectedPieza(null);
        setOpenModalEditarStock(false);
    };


    return (
        <>
            <header>
                <Button
                    className="boton"
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={handleOpenCrearPieza}
                >
                    CREAR PIEZA
                </Button>
            </header>

            <main>
                {isLoadingPiezas ? (
                    <p>Cargando...</p>
                ) : piezas && piezas.length > 0 ? (
                    piezas.map((pieza) => (
                        <Accordion key={pieza.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography component="span">
                                    {pieza.nombre} — STOCK: {pieza.stock}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Typography>NOMBRE: {pieza.nombre}</Typography>
                                <Typography>STOCK: {pieza.stock}</Typography>
                            </AccordionDetails>

                            <AccordionActions>
                                <Button onClick={() => handleOpenEditarPieza(pieza)}>EDITAR</Button>
                                <Button onClick={() => handleOpenEliminarPieza(pieza.id)}>ELIMINAR</Button>
                                <Button onClick={() => handleOpenEditarStock(pieza)}>STOCK</Button>
                            </AccordionActions>
                        </Accordion>
                    ))
                ) : (
                    "No hay piezas registradas"
                )}
            </main>

            <ModalCrearPieza
                open={openModalCrearPieza}
                handleClose={handleCloseCrearPieza}
                refetchPiezas={refetchPiezas}
            />
            {selectedPiezaId !== null && (
                <ModalEliminarPieza
                    open={openModalEliminarPieza}
                    handleClose={handleCloseEliminarPieza}
                    refetchPiezas={refetchPiezas}
                    id={selectedPiezaId}
                />
            )}

            {selectedPieza && (
                <ModalEditarPieza
                    open={openModalEditarPieza}
                    handleClose={handleCloseEditarPieza}
                    refetchPiezas={refetchPiezas}
                    pieza={selectedPieza}
                />
            )}

            {selectedPieza && (
                <ModalEditarStock
                    open={openModalEditarStock}
                    handleClose={handleCloseEditarStock}
                    refetchPiezas={refetchPiezas}
                    pieza={selectedPieza}
                />
            )}
        </>
    );
}

export default Piezas;