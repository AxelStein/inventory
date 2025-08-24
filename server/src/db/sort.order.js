export const createSortOrder = (sortBy, sortAsc) => {
    return sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined;
};