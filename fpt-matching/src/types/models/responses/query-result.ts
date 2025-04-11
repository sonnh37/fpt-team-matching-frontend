interface QueryResult<TResult> {
    results?: TResult[];
    totalPages?: number;
    totalRecords?: number;
    pageNumber?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    isPagination: boolean;
}

enum SortOrder {
    Ascending = 'Ascending',
    Descending = 'Descending'
}
