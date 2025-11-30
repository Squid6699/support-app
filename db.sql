-- ================================
--  CREACION DE TABLAS BASE
-- ================================

CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    celular VARCHAR(20),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    rol_id INT REFERENCES Rol(id)
);

CREATE TABLE Prioridad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Marca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE TipoEquipo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Edificio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    encargado_id INT REFERENCES Persona(id)
);

CREATE TABLE Aula (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edificio_id INT REFERENCES Edificio(id)
);

CREATE TABLE Equipo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    aula_id INT REFERENCES Aula(id),
    marca_id INT REFERENCES Marca(id),
    tipo_id INT REFERENCES TipoEquipo(id)
);

CREATE TABLE Pieza (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATE,
    marca_id INT REFERENCES Marca(id)
);

CREATE TABLE Equipo_Pieza (
    equipo_id INT REFERENCES Equipo(id),
    pieza_id INT REFERENCES Pieza(id),
    PRIMARY KEY (equipo_id, pieza_id)
);

-- ================================
-- Catalogo de Problemas Comunes
-- ================================

CREATE TABLE CatalogoIncidentes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    solucion TEXT NOT NULL,
    horas_promedio INT NOT NULL
);

-- ================================
-- Servicios (modificada)
-- ================================

CREATE TABLE Servicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    solucion TEXT NOT NULL,
    tecnico_id INT REFERENCES Persona(id),
    horas INT,
    calificacion INT DEFAULT 0
);

-- ================================
-- ENUM estado de incidentes
-- ================================

CREATE TYPE estado_incidente AS ENUM ('NO INICIADO', 'EN PROCESO', 'TERMINADO', 'LIBERADO');

-- ================================
-- Tabla Incidente
-- ================================

CREATE TABLE Incidente (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    descripcion VARCHAR(100) NOT NULL,
    usuario_id INT REFERENCES Persona(id),
    tecnico_id INT REFERENCES Persona(id),
    equipo_id INT REFERENCES Equipo(id),
    prioridad_id INT REFERENCES Prioridad(id),
    servicio_id INT REFERENCES Servicio(id),
    finalizado BOOLEAN DEFAULT false,
    fecha_fin DATE,
    autorizada BOOLEAN DEFAULT false,
    estado estado_incidente DEFAULT 'NO INICIADO' NOT NULL
);

-- ================================
-- INSERTS
-- ================================

INSERT INTO Rol (nombre) VALUES
('Administrador'),
('Tecnico Hardware'),
('Tecnico Software'),
('Encargado Edificio');

INSERT INTO Prioridad (nombre) VALUES
('Alta'),
('Media'),
('Baja'),
('Preventiva');

INSERT INTO Marca (nombre) VALUES
('Dell'),
('HP'),
('Lenovo'),
('Asus'),
('Logitech');

INSERT INTO TipoEquipo (nombre) VALUES
('Laptop'),
('Proyector'),
('Impresora'),
('Servidor'),
('PC Escritorio');

INSERT INTO Persona (nombre, celular, correo, contraseña, rol_id) VALUES
('Carlos Pérez', '5551234567', 'carlos.perez@uni.edu', 'pass123', 1),
('Ana Torres', '5559876543', 'ana.torres@uni.edu', 'pass123', 2),
('Luis Gómez', '5553217890', 'luis.gomez@uni.edu', 'pass123', 3),
('Marta López', '5556543210', 'marta.lopez@uni.edu', 'pass123', 4),
('Victoria Armenta', '6672945113', 'victoria.armenta@uni.edu', 'pass123', 4);


INSERT INTO Pieza (nombre, fecha, marca_id) VALUES
('Disco Duro 1TB', '2024-03-01', 1),
('Memoria RAM 16GB', '2024-02-20', 2),
('Fuente de Poder 600W', '2024-01-10', 3),
('Tarjeta Madre ATX', '2023-12-15', 4),
('Mouse Inalámbrico', '2024-04-05', 5);

-- INSERT INTO Equipo_Pieza (equipo_id, pieza_id) VALUES
-- (1, 1),
-- (1, 2),
-- (3, 3),
-- (4, 4),
-- (1, 5);

-- ================================
-- INSERTS EN CATALOGO
-- ================================

INSERT INTO CatalogoIncidentes (titulo, descripcion, solucion, horas_promedio) VALUES
('Falla en Disco Duro', 'El equipo no arranca debido a sectores dañados en el disco.', 'Reemplazo del disco duro', 3),
('Falla en Memoria RAM', 'El equipo muestra pantallazos o reinicios inesperados.', 'Cambio o reinstalación de memoria RAM', 2),
('Fuente de Poder Dañada', 'El equipo no enciende o se apaga solo.', 'Sustitución de la fuente de poder', 2),
('Tarjeta Madre Defectuosa', 'No hay señal de video o fallas graves.', 'Reparación o reemplazo de la tarjeta madre', 4),
('Falla en Mouse Inalámbrico', 'Movimientos erráticos o sin respuesta.', 'Reemplazo o reparación del mouse', 1);
