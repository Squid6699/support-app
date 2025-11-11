import type { Dayjs } from "dayjs";

export interface Incidencia {
    fecha: Dayjs | null;
    descripcion: string;
    usuario_id: number;
    equipo_id: number;
    prioridad_id: number;
}

export interface Incidencias {
    incidencia_id: number;
    fechaincidencia: Date;
    descripcion_incidencia: string;
    estado_incidencia: string;
    id_prioridad: number;
    prioridad: string;
    equipo_id: number;
    equipo_nombre: string;
    edificio_id: number;
    edificio: string;
    aula_id: number;
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

export interface EquiposPorEncargado {
    id: number;
    nombreequipo: string;
    fechaequipo: string;
    nombreaula: string;
    nombreedificio: string;
}

export interface EquipoDetalles {
    id: number;
    fechaequipo: string;
    idincidente: number;
    descripcionincidente: string;
    nombretecnico: string | null;
    prioridad: string;
    estadoincidencia: string;
    nombreservicio: string | null;
    descripcionservicio: string | null;
    horasservicio: number | null;
    calificacionservicio: number | null;
}

export interface ServicioDeEquipo {
  id_incidencia: number | null;
  descripcion_incidencia: string | null;
  nombre_tecnico: string | null;
  prioridad: string | null;
  nombre_servicio: string | null;
  descripcion_servicio: string | null;
  horas_servicio: number | null;
  incidencia_finalizada: boolean | null;
  fecha_termino_incidencia: string | null;
  calificacion_servicio: number | null;
  autorizada_incidencia: boolean | null;
  estado_incidencia: string | null;
}

export interface EquipoConServicios {
  id_equipo: number;
  nombre_equipo: string;
  fecha_equipo: string;
  nombre_aula: string;
  nombre_edificio: string;
  servicios: ServicioDeEquipo[]; // ← array de servicios del equipo
}
