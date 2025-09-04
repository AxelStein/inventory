import { InventoryFieldState, InventoryFieldType, type InventoryField } from "api/inventory/inventory.types";
import { useGetItemsQuery } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { useContext, useEffect, useState } from "react";
import { Button, Col, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdCheckBox, MdCheckBoxOutlineBlank, MdDelete, MdDeleteOutline, MdFavorite, MdFavoriteBorder, MdHeartBroken } from "react-icons/md";
import ItemEditorModal from "./ItemEditorModal";
import { isGuest } from "~/auth/auth.check.guest";
import { formatRelative } from "date-fns/formatRelative";
import { useSelector } from "react-redux";
import { useLikeItemMutation, useUnlikeItemMutation } from "api/item/item.like.api";

export default function ItemPage() {
    const { inventory } = useContext(InventoryContext);
    const { data, isLoading, refetch } = useGetItemsQuery({
        inventoryId: inventory!.id,
        asGuest: isGuest(),
        perPage: 20
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const currentUser = useSelector((state: any) => state.auth.user);

    const handleOnAddClick = () => {
        setEditItem(null);
        setModalVisible(true);
    };
    const handleHideModal = () => {
        setModalVisible(false);
    };
    const handleSetItem = (item: InventoryItem) => {
        refetch();
        setModalVisible(false);
    };
    const handleItemClick = (item: InventoryItem) => {
        setEditItem(item);
        setModalVisible(true);
    }

    if (!data || isLoading) {
        return <div className="spinner" />;
    }

    const fields = inventory!.fields?.filter(f => f.state == 'visible') || [];
    fields.unshift({
        uid: "customId",
        name: "ID",
        state: InventoryFieldState.visible,
        type: InventoryFieldType.customId
    });

    const canAdd = inventory!.permissions?.item?.create == true;
    const canDelete = inventory!.permissions?.item?.delete == true;

    return <Col>
        {(canAdd || canDelete) && (
            <div className="mb-3">
                {canAdd && (
                    <Button variant='outline-primary' className='me-2' onClick={handleOnAddClick}>
                        <MdAdd /> Add
                    </Button>
                )}
                {canDelete && (
                    <Button variant='outline-danger' className='me-2'>
                        <MdDeleteOutline />
                    </Button>
                )}
            </div>
        )}
        <Table hover responsive>
            <thead>
                <tr>
                    <FormCheck />
                    {fields.map(createColumn)}
                    <th>Created at</th>
                    <th>Updated at</th>
                    <th>Likes</th>
                </tr>
            </thead>
            <tbody>
                {data.items.map(item => <ItemRow item={item} fields={fields} onClick={handleItemClick} />)}
            </tbody>
        </Table>
        {inventory && (
            <ItemEditorModal
                inventory={inventory}
                show={modalVisible}
                editItem={editItem}
                setItem={handleSetItem}
                fields={fields}
                onHide={handleHideModal} />
        )}
    </Col>
}

function createColumn(field: InventoryField) {
    return <th>{field.name}</th>;
}


interface ItemRowProps {
    item: InventoryItem,
    fields: InventoryField[],
    onClick: (item: InventoryItem) => void
}

function ItemRow({ item, fields, onClick }: ItemRowProps) {
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
        (ownLike ? unlikeItem(item.id) : likeItem(item.id))
            .unwrap()
            .then(() => {
                setLikeCount(likeCount + (ownLike ? -1 : 1));
                setOwnLike(!ownLike);
            })
            .catch(err => console.log(err));
    }

    return <tr onClick={handleClick}>
        <FormCheck className="no-row-click" />
        {
            fields.map(field => {
                const value = (item as any)[field.uid];
                if (field.type === 'boolean') {
                    return <td>{value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}</td>;
                }
                return <td>{value}</td>;
            })
        }
        <td>{formatRelative(item.createdAt, new Date())}</td>
        <td>{formatRelative(item.updatedAt, new Date())}</td>
        <td className="no-row-click" onClick={handleFavoriteClick}>
            {ownLike ? (<MdFavorite color="#c44512" />) : (<MdFavoriteBorder />)} {likeCount}
        </td>
    </tr>;
}