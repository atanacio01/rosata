export class Usuario {
    token: string;
    user: UsuarioDetalle;
}

export class UsuarioDetalle {
    id: number;
    Nombre: string;
    Correo: string;
    // Password: string;
    token: string;
}