interface PaginatedResult<TResult> {
    results?: TResult[];
    totalPages?: number;
    totalRecordsPerPage?: number;
    totalRecords?: number;
    pageNumber?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: SortOrder;
}

enum SortOrder {
    Ascending = 'Ascending',
    Descending = 'Descending'
}
