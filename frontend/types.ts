export interface Incidencia {
    fecha: null;
    descripcion: string;
    usuario_id: number;
    equipo_id: number;
    prioridad_id: number;
}

export interface Incidencias{
    incidencia_id: number;
    fechaincidencia: Date;
    descripcion_incidencia: string;
    estado_incidencia: string;
    prioridad: string;
    equipo_id: number;
    equipo_nombre: string;
    edificio: string;
    aula: string;
    autorizada: boolean;
    tecnico_nombre: string | null;
}

export interface Usuario {
    id: number;
    nombre: string;
    celular: string;
    correo: string;
    rol: string;
}

export interface EquiposPorEncargado {
    id: number;
    nombreequipo: string;
    fechaequipo: string;
    nombreaula: string;
    nombreedificio: string;
}

export interface Edificio {
    id: number;
    nombre: string;
}

export interface Aula {
    id: number;
    nombre: string;
    edificio_id: number;
}

export interface EquipoAula {
    id: number;
    nombre: string;
    aula_id: number;
}

export interface Prioridad {
    id: number;
    nombre: string;
}