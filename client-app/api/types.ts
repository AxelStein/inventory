export interface PagingList<T> {
    items: T[];
    totalCount: number;
    hasMore: boolean;
    page: number;
    perPage: number;
    pageCount: number;
}

export interface PagingListProps {
    sortBy?: string;
    sortAsc?: boolean;
    page?: number;
    perPage?: number;
}