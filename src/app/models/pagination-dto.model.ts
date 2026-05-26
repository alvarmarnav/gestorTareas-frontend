import { TaskdtoModel } from "./taskdto.model";

export interface PaginationDto<T> {
    data:T[];
    pageNumber:number;
    pageSize:number;
    totalItems:number;
    totalPages:number;
    hasPageBefore:boolean;
    hasPageAfter:boolean;
}
