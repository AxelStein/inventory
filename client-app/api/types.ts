export interface PagingList<T> {
    items: T[],
    totalCount: number,
    hasMore: boolean,
}

export interface PagingListParams {
    sortBy?: string;
    sortAsc?: boolean;
    page?: number;
    perPage?: number;
}