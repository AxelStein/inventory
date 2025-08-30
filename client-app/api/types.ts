export interface PagingList<T> {
    items: T[],
    totalCount: number,
    hasMore: boolean,
}