// src/app/cliente.model.ts
export interface Cliente {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    correo: string;
    direccion: string;
    password: string;
    estado: string;
    tipo: string;
    // Agrega más propiedades según tu API
}