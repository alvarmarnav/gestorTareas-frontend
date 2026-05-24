import { TaskdtoModel } from "./taskdto.model";

export interface PaginationDto<T> {
    items:T[],
    pageNumber:number,
    pageSize:number,
    totalItems:number,
    totalPages:number,
}
