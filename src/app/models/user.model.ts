export interface UserModel {
id: number;
userName: string;
userLastName: string;
email: string;
isAdmin: boolean;
}
export interface PaginadoDto<T> {
datos: T[];
paginaActual: number;
totalPaginas: number;
totalRegistros: number;
registrosPorPagina: number;
}