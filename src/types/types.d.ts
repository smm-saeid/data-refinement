
import {type GridSortDirection} from "@mui/x-data-grid";
// import {DeputiesEnum, InspectionScopesEnum} from "shared/consts";

export interface ISelectableItem<T> {
    mode: TCrudType;
    item?: T;
}

export type TCrudType = "CREATE" | "VIEW" | "EDIT";

export interface IQueryParamFilter<T> extends T {}
export interface IQueryParamFilter<T> extends T {
    sortBy?: string; //keyof T;
    sortDir?: GridSortDirection;
    pageSize?: number;
    currentPage?: number;
    count?: number;
}

// export interface PaginationQueryParam<T extends object = {}> extends T {
//     sortBy?: string;
//     sortDir?: GridSortDirection;
//     pageSize?: number;
//     currentPage?: number;
//     count?: number;
// }


export interface IBaseData {
    id: number;
    name: string;
    faName: string;
    enName: string;
}

export interface IQueryFilter {
    sortBy?: string;
    sortDir?: GridSortDirection;
    pageSize?: number;
    currentPage?: number;
    count?: number;
}

export type IQueryFilterType<GenericType = {}> = {
    sortBy?: string;
    sortDir?: GridSortDirection;
    pageSize?: number;
    currentPage?: number;
    count?: number;
} & {
    [key in keyof Partial<GenericType>]: GenericType[key]
}

export type ThemeMode = "light" | "dark";

export type PlannedUnit = {
    name: string,
    id: string,
    parentId: string,
    parentName: string,
    description: string
}

export type PlannedSeason = {
    spring: Array<PlannedUnit>,
    summer: Array<PlannedUnit>,
    fall: Array<PlannedUnit>,
    winter: Array<PlannedUnit>
}


export type DeputyData = {
    name: string,
    status: string,
    seasonsUnits: PlannedSeason
}

export type ProfessionalPlanning = {
    id: number,
    YEAR: number,
    DEPUTIES: DeputyList,
    STATE: string,
    percent: number,

}

export type ScopePlanning = {
    id: number,
    YEAR: number,
    SCOPES: ScopeList,
    STATE: string,
    percent: number,

}

// export type DeputyList = {
//     [keys in DeputiesEnum]: DeputyData;
// }

// export type ScopeList = {
//     [keys in InspectionScopesEnum]: DeputyData;
// }

export type Unit = {

    "id": string,
    "name": string,
    "code": string,
    "active": boolean,
    "codePath": string,
    "completeName": string,
    "parentId": string,
    "parentName": string
}


export type ApiResponseType<ResponseType = null> = {
    data: ResponseType;
    status: number;
    message: string;
};

export type PageResponseType<ResponseType = null> = {
    rows: Array<ResponseType>;
    pageSize: number;
    count: number;
    currentPage: number;
    sortBy: string;
};

