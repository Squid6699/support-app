import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Typography from "@mui/material/Typography";
import type { CatalogoIncidencias, Incidencias } from "../../types";
import { useSesion } from "../hook/useSesion";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Problemas() {
    const { id } = useSesion();

    const HOST = import.meta.env.VITE_HOST

    const { data: problemas, isLoading: isLoadingProblemas, refetch: refetchProblemas } = useQuery<CatalogoIncidencias[]>({
        queryKey: ["Problemas"],
        queryFn: obtenerCatalogosProblemas,
    });


    //SACAR INCIDENCIAS DEL ENCARGADO
    async function obtenerCatalogosProblemas() {
        try {

            const response = await fetch(HOST + "api/catalogoIncidencias", {
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
            <main>
                {isLoadingProblemas ? <p>Cargando...</p> :

                    problemas && problemas.length > 0 ? (
                        problemas.map((problema) => {

                            

                            return (
                                <Accordion key={problema.id_catalogo_incidente}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>{problema.titulo_catalogo_incidente.toUpperCase()}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="span">DESCRIPCION: {problema.descripcion_catalogo_incidente.toUpperCase()}<br /></Typography>
                                        <Typography component="span">SOLUCION: {problema.solucion_catalogo_incidente.toUpperCase()}<br /></Typography>
                                        <Typography component="span">HORAS: {problema.horas_promedio_catalogo_incidente}</Typography>

                                    </AccordionDetails>
                                    <AccordionActions>
                                    </AccordionActions>
                                </Accordion>
                            );
                        })
                    ) : "No hay incidencias asignadas a tu cargo"}
            </main >
            

        </>

    );
}
export default Problemas;