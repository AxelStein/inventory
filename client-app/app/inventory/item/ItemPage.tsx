import { InventoryFieldState, InventoryFieldType, type InventoryField } from "api/inventory/inventory.types";
import { useDeleteItemsByIdsMutation, useGetItemsQuery } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { useContext, useEffect, useState } from "react";
import { Button, Col, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdCheckBox, MdCheckBoxOutlineBlank, MdDeleteOutline, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import ItemEditorModal from "./ItemEditorModal";
import { isGuest } from "~/auth/auth.check.guest";
import { useSelector } from "react-redux";
import { useLikeItemMutation, useUnlikeItemMutation } from "api/item/item.like.api";
import InfiniteScroll from 'react-infinite-scroll-component';
import TableDateData from "~/components/TableDateData";
import { useTranslation } from "react-i18next";
import Loader from "~/components/Loader";
import { usePagingListState } from "~/components/paging.list.state";
import ErrorAlert from "~/components/ErrorAlert";

export default function ItemPage() {
    const { t } = useTranslation();
    const { inventory } = useContext(InventoryContext);
    const {
        sortBy,
        sortAsc,
        page,
        handleColumnClick,
        fetchNextPage,
        renderSortIndicator,
        setPage
    } = usePagingListState('customId');
    const { data, isLoading, error, refetch } = useGetItemsQuery({
        inventoryId: inventory!.id,
        asGuest: isGuest(),
        sortBy: sortBy,
        sortAsc: sortAsc,
        page: page,
        perPage: 20
    }, { skip: inventory == null || inventory == undefined });
    const [modalVisible, setModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [checkedItems, setCheckedItems] = useState(new Set<number>());
    const [deleteItemsByIds] = useDeleteItemsByIdsMutation();
    const [items, setItems] = useState<InventoryItem[]>([]);

    const canAdd = inventory?.permissions?.item?.create == true;
    const canDelete = inventory?.permissions?.item?.delete == true;
    const canEdit = inventory?.permissions?.item?.update == true;

    useEffect(() => {
        if (!data) return;
        if (page === 1) {
            setItems(data.items);
        } else {
            setItems([...items, ...data.items]);
        }
        setCheckedItems(new Set());
    }, [data]);

    const refreshData = () => {
        setPage(1);
        refetch();
    }

    const handleOnAddClick = () => {
        setEditItem(null);
        setModalVisible(true);
    };
    const handleHideModal = () => {
        setModalVisible(false);
    };
    const handleSetItem = (item: InventoryItem | null) => {
        setModalVisible(false);
        refreshData();
    };
    const handleItemClick = (item: InventoryItem) => {
        if (canEdit) {
            setEditItem(item);
            setModalVisible(true);
        }
    }
    const handleItemCheck = (item: InventoryItem) => {
        const checked = new Set(checkedItems);
        if (checked.has(item.id)) {
            checked.delete(item.id);
        } else {
            checked.add(item.id);
        }
        setCheckedItems(checked);
    }
    const handleAllItemsCheck = () => {
        if (checkedItems.size === items.length) {
            setCheckedItems(new Set());
        } else {
            setCheckedItems(new Set(items.map(item => item.id)));
        }
    }
    const handleDeleteItemsClick = () => {
        deleteItemsByIds({
            inventoryId: inventory!.id,
            ids: [...checkedItems]
        }).unwrap().then(refreshData);
    }

    const fields = inventory!.fields?.filter(f => f.state == 'visible') || [];
    fields.unshift({
        uid: "customId",
        name: "ID",
        state: InventoryFieldState.visible,
        type: InventoryFieldType.customId
    });

    const tableFields = [...fields];
    tableFields.push({
        uid: 'createdAt',
        name: 'Created at',
        state: InventoryFieldState.visible,
        type: InventoryFieldType.customId
    });
    tableFields.push({
        uid: 'updatedAt',
        name: 'Updated at',
        state: InventoryFieldState.visible,
        type: InventoryFieldType.customId
    });
    tableFields.push({
        uid: 'likeCount',
        name: 'Likes',
        state: InventoryFieldState.visible,
        type: InventoryFieldType.customId
    });

    const Actions = () => {
        if (!canAdd && !canDelete) return null;
        return <div className="mb-3">
            {canAdd && (
                <Button
                    variant='outline-primary'
                    className='me-2'
                    onClick={handleOnAddClick}>
                    <MdAdd /> {t('actions.add')}
                </Button>
            )}
            {canDelete && (
                <Button
                    variant='outline-danger'
                    className='me-2'
                    onClick={handleDeleteItemsClick}
                    disabled={checkedItems.size === 0}>
                    <MdDeleteOutline />
                </Button>
            )}
        </div>
    }
    const TableHeaders = () => {
        return <>
            <th>
                <FormCheck
                    checked={checkedItems.size === items.length}
                    onClick={handleAllItemsCheck} />
            </th>
            {
                tableFields.map((field) => (
                    <th onClick={() => handleColumnClick(field.uid)}>{field.name} {renderSortIndicator(field.uid)}</th>
                ))
            }
        </>
    }
    const Rows = () => {
        return items.map(item => (
            <ItemRow
                item={item}
                fields={tableFields}
                onClick={handleItemClick}
                isChecked={checkedItems.has(item.id)}
                toggleChecked={handleItemCheck} />
        ));
    }
    const NoData = () => {
        if (isLoading || error) return null;
        return items.length === 0 && <p className="no-data">{t('items.noData')}</p>;
    }
    const Error = () => <ErrorAlert error={error} />

    return <InfiniteScroll
        hasMore={data?.hasMore === true}
        dataLength={items.length}
        next={fetchNextPage}
        loader={(<Loader />)}>
        <Col>
            <Actions />
            <Table hover responsive>
                <thead>
                    <tr>
                        <TableHeaders />
                    </tr>
                </thead>
                <tbody>
                    <Rows />
                </tbody>
            </Table>

            <NoData />
            <Error />
            <Loader loading={isLoading && page === 1} />

            {inventory && (
                <ItemEditorModal
                    canDelete={canDelete}
                    inventory={inventory}
                    show={modalVisible}
                    editItem={editItem}
                    setItem={handleSetItem}
                    fields={fields}
                    onHide={handleHideModal} />
            )}
        </Col>
    </InfiniteScroll>
}

interface ItemRowProps {
    item: InventoryItem;
    fields: InventoryField[];
    onClick: (item: InventoryItem) => void;
    isChecked: boolean;
    toggleChecked: (item: InventoryItem) => void;
}

function ItemRow({ item, fields, onClick, isChecked, toggleChecked }: ItemRowProps) {
    const currentUser = useSelector((state: any) => state.auth.user);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [ownLike, setOwnLike] = useState<boolean>(false);
    const [likeItem] = useLikeItemMutation();
    const [unlikeItem] = useUnlikeItemMutation();

    useEffect(() => {
        setLikeCount(item.likes?.length ?? 0);
        setOwnLike(item.likes?.some(like => like.user.id === currentUser?.id) ?? false);
    }, [item]);

    const handleClick = (event: any) => {
        const target = event.target as Element;
        if (!target.closest('.no-row-click')) {
            onClick(item);
        }
    }

    const handleFavoriteClick = () => {
        if (isGuest()) return;
        (ownLike ? unlikeItem(item.id) : likeItem(item.id))
            .unwrap()
            .then(() => {
                setLikeCount(likeCount + (ownLike ? -1 : 1));
                setOwnLike(!ownLike);
            })
            .catch(err => console.log(err));
    }

    return <tr onClick={handleClick}>
        <td>
            <FormCheck
                className="no-row-click"
                checked={isChecked}
                onChange={() => toggleChecked(item)}
            />
        </td>
        {
            fields.map(field => {
                const value = (item as any)[field.uid];
                if (field.type === 'boolean') {
                    return <td>{value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}</td>;
                }
                switch (field.uid) {
                    case 'createdAt':
                        return <td><TableDateData date={item.createdAt} /></td>;

                    case 'updatedAt':
                        return <td><TableDateData date={item.updatedAt} /></td>;

                    case 'likeCount':
                        return <td
                            className="no-row-click"
                            onClick={handleFavoriteClick}>
                            {ownLike ? (<MdFavorite color="#c44512" />) : (<MdFavoriteBorder />)} {likeCount}
                        </td>
                }
                if (field.type === InventoryFieldType.link) {
                    return <td className="no-row-click"><a href={value} target="_blank">{value}</a></td>;
                }
                return <td>{value}</td>;
            })
        }

    </tr>;
}