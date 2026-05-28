import { TaskdtoModel } from "./taskdto.model";

export interface PaginationDto<T> {
    data:T[];
    actualPage:number;
    itemsPerPage:number;
    totalItems:number;
    totalPages:number;
    hasPageBefore:boolean;
    hasPageAfter:boolean;
}
