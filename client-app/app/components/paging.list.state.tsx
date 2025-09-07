import { useState } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";

export const usePagingListState = (initSortBy: string = '', initSortAsc: boolean = true) => {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState(initSortBy);
    const [sortAsc, setSortAsc] = useState(initSortAsc);
    const renderSortIndicator = (column: string) => {
        if (column === sortBy) {
            return sortAsc ? <MdArrowUpward /> : <MdArrowDownward />;
        }
        return null;
    }
    const handleColumnClick = (column: string) => {
        setPage(1);
        if (column === sortBy) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(column);
        }
    }
    const fetchNextPage = () => {
        setPage(page + 1);
    }
    return {
        sortBy,
        sortAsc,
        page,
        renderSortIndicator,
        setSortBy,
        setSortAsc,
        setPage,
        handleColumnClick,
        fetchNextPage
    };
}