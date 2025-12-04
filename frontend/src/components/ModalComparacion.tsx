import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import { Incidencias } from '../../types'; // Asegúrate de importar el tipo correcto
import { useQuery } from "@tanstack/react-query";
import toast from 'react-hot-toast';

// Define un tipo para los resultados de la comparación (Problemas Comunes)
interface ProblemaComun {
    id: number;
    titulo: string;
    descripcion: string;
    solucion: string;
    desc_similarity: number;
    title_similarity: number;
}

interface ModalProps {
    open: boolean;
    handleCloseModalComparacion: () => void;
    incidencia: Incidencias | null;
    refetchIncidencias: () => void;
}

const HOST = import.meta.env.VITE_HOST;

export default function ModalComparacion({ open, handleCloseModalComparacion, incidencia, refetchIncidencias }: ModalProps) {

    const obtenerProblemasComunes = async (): Promise<ProblemaComun[]> => {
        if (!incidencia?.incidencia_id) return [];

        try {
            const url = HOST + "api/compararIncidencia/" + incidencia.incidencia_id;

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'x-frontend-header': 'frontend' },
            });
            const data = await response.json();

            if (data.success) {
                return data.problemasComunes;
            } else {
                return [];
            }
        } catch {
            throw new Error("Error al obtener problemas comunes");
        }
    }

    const { data: problemasComunes, isLoading, isFetching } = useQuery<ProblemaComun[]>({
        queryKey: ["problemasComunes", incidencia?.incidencia_id],
        queryFn: obtenerProblemasComunes,
        enabled: open && !!incidencia?.incidencia_id,
    });

    const submitSeleccionProblemaComun = async (problemaId: number) => {
        try {
            const response = await fetch(HOST + "api/seleccionarProblemaComun", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend'
                },
                body: JSON.stringify({ "idCatalogo": problemaId, "idIncidencia": incidencia?.incidencia_id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                handleCloseModalComparacion();
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("OCURRIO UN ERROR");
        }
    }

    return (
        <Dialog open={open} onClose={handleCloseModalComparacion} fullWidth maxWidth="md">
            <DialogTitle>
                Comparación de Incidencia
            </DialogTitle>
            <DialogContent dividers>
                {isLoading || isFetching ? (
                    <CircularProgress />
                ) : problemasComunes && problemasComunes.length > 0 ? (
                    <>
                        <Typography variant="h6" gutterBottom>Problemas Comunes Similares Encontrados:</Typography>
                        <Typography variant="body1" color="textSecondary" style={{ marginBottom: 16 }}>
                            Incidencia a comparar: {incidencia?.descripcion_incidencia}
                        </Typography>

                        {problemasComunes.map((problema) => (
                            <div key={problema.id} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10, borderRadius: 5 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {problema.titulo} (Similitud: {Math.round(problema.desc_similarity * 100)}%)
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Descripción del Catálogo: {problema.descripcion}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    Solución Sugerida: {problema.solucion}
                                </Typography>
                                <Button onClick={() => submitSeleccionProblemaComun(problema.id)}>Seleccionar</Button>
                            </div>
                        ))}
                    </>
                ) : (
                    <Typography>No se encontraron problemas comunes similares en el catálogo.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModalComparacion}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}