export interface BusinessResult<Tdata> {
    status: number;
    message?: string;
    data?: Tdata;
}


export interface BusinessResultBool{
    status: number;
    message?: string;
    data?: boolean;
}