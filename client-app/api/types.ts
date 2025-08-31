export interface PagingList<T> {
    items: T[],
    totalCount: number,
    hasMore: boolean,
}

export interface PagingListProps {
    sortBy?: string;
    sortAsc?: boolean;
    page?: number;
    perPage?: number;
}