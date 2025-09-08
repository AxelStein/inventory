import { useGetInventoriesQuery } from "api/inventory/inventory.api";
import { type Inventory, type InventoryListFilter } from "api/inventory/inventory.types";
import type { InventoryTag } from "api/tag/tag.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router";
import { isGuest } from "~/auth/auth.check.guest";
import Loader from "~/components/Loader";
import { usePagingListState } from "~/components/paging.list.state";
import { InventoryTable } from "~/inventory/components/InventoryTable";

export default function InventoryListPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const {
        sortBy,
        sortAsc,
        page,
        handleColumnClick,
        fetchNextPage,
        renderSortIndicator,
    } = usePagingListState(
        searchParams.get('sortBy') ?? 'title',
        searchParams.get('sortAsc')?.toLowerCase() === 'true'
    );
    const [items, setItems] = useState<Inventory[]>([]);

    const { data, error, isLoading } = useGetInventoriesQuery({
        page: page,
        perPage: 20,
        sortBy: sortBy,
        sortAsc: sortAsc,
        asGuest: isGuest(),
        tagId: searchParams.get('tagId') ?? undefined,
    });
    const tagName = searchParams.get('tagName');

    useEffect(() => {
        if (!data) return;
        if (page === 1) {
            setItems(data.items);
        } else {
            setItems([...items, ...data.items]);
        }
    }, [data]);

    return <InfiniteScroll
        hasMore={data?.hasMore == true}
        dataLength={items.length}
        next={fetchNextPage}
        loader={(<Loader />)}>
        <InventoryTable
            title={tagName ? t('inventoryList.titleByTag', { tagName }) : undefined}
            error={error}
            isLoading={isLoading && page === 1}
            handleColumnClick={handleColumnClick}
            renderSortIndicator={renderSortIndicator}
            inventories={items} />
    </InfiniteScroll>
}