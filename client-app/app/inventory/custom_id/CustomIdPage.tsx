import { Reorder } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { InventoryContext } from "../InventoryPage";
import { Button, Col, Container, Form } from "react-bootstrap";
import { MdAdd, MdDeleteOutline, MdDragIndicator } from "react-icons/md";
import { useGetAppConfigQuery } from "api/app/app.api";
import { CustomIdType } from "api/app/app.types";
import { useCreateCustomIdMutation, useDeleteCustomIdMutation, useGetCustomIdsQuery, useReorderCustomIdsMutation, useUpdateCustomIdMutation } from "api/custom_id/custom.id.api";
import type { InventoryCustomId } from "api/custom_id/custom.id.types";
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import AppToastContainer from "~/components/AppToastContainer";
import { useTranslation } from "react-i18next";

const getCustomIdTypeLabel = (type: CustomIdType): string => {
    switch (type) {
        case CustomIdType.FIXED:
            return "Fixed";

        case CustomIdType.RND_20_BIT:
            return "Random 20-bit";

        case CustomIdType.RND_32_BIT:
            return "Random 32-bit";

        case CustomIdType.RND_6_DIGIT:
            return "Random 6-digit";

        case CustomIdType.RND_9_DIGIT:
            return "Random 9-digit";

        case CustomIdType.GUID:
            return "GUID";

        case CustomIdType.DATE_TIME:
            return "Date / time";

        case CustomIdType.SEQUENCE:
            return "Sequence";
    }
}

const MAX_ID_COUNT = 10;

export default function CustomIdPage() {
    const { data: appConfig } = useGetAppConfigQuery();
    const { inventory } = useContext(InventoryContext);
    const { data: customIdsQuery } = useGetCustomIdsQuery(inventory?.id ?? 0, { skip: !inventory });
    const [createItem] = useCreateCustomIdMutation();
    const [updateItem] = useUpdateCustomIdMutation();
    const [deleteItem] = useDeleteCustomIdMutation();
    const [reorderItems] = useReorderCustomIdsMutation();
    const { t } = useTranslation();
    const items = useRef(new Map<number, InventoryCustomId>());
    const [ids, setIds] = useState<number[]>([]);
    const debounceMap = useRef(new Map<number, any>());

    useEffect(() => {
        if (customIdsQuery) {
            items.current = new Map(customIdsQuery.map(item => [item.id, item]));
            setIds(customIdsQuery.map(item => item.id));
        }
    }, [customIdsQuery]);

    const handleError = (err: any) => {
        toast.error(err.data ? err.data.message : t('networkError'));
    }

    const setItem = (newItem: InventoryCustomId) => {
        items.current.set(newItem.id, newItem);
        if (!ids.includes(newItem.id)) {
            setIds([...ids, newItem.id]);
        } else {
            setIds([...ids]);
        }
    }

    const handleChangeIdType = (item: InventoryCustomId, type: string) => {
        updateItem({
            id: item.id,
            type: type,
            rule: item.rule,
        }).unwrap().then(setItem);
    }

    const handleChangeIdRule = (item: InventoryCustomId, rule: string) => {
        setItem({ ...item, rule });

        debounceMap.current.get(item.id)?.cancel();
        const d = debounce(() => {
            const it = items.current?.get(item.id);
            if (it) {
                updateItem(it);
            }
        }, 1500);
        debounceMap.current.set(item.id, d);
        d();
    }

    const handleAddItemClick = () => {
        createItem({ inventoryId: inventory!.id, type: CustomIdType.SEQUENCE })
            .unwrap()
            .then(setItem)
            .catch(handleError);
    }

    const handleDeleteItemClick = (item: InventoryCustomId) => {
        deleteItem(item.id)
            .unwrap()
            .then(() => {
                items.current?.delete(item.id);
                setIds(ids.filter((id) => id !== item.id));
            })
            .catch(handleError);
    }

    const handleDragEnd = () => {
        reorderItems({
            inventoryId: inventory!.id,
            customIds: ids,
        }).unwrap().catch(handleError);
    }

    return <Container className="d-flex justify-content-center">
        <Col md={6}>
            <Form>
                <Reorder.Group
                    axis="y"
                    onReorder={setIds}
                    values={ids}
                    className="custom-id-group">

                    {ids.map(id => {
                        const item = items.current.get(id)!;
                        return <Reorder.Item
                            key={id}
                            value={id}
                            onDragEnd={handleDragEnd}
                            className='mb-3'>

                            <div className="d-flex align-items-center custom-id-row">
                                <div className="custom-id-drag-indicator">
                                    <MdDragIndicator
                                        className="me-3"
                                        size='24px' />
                                </div>

                                <Form.Select
                                    className="me-3"
                                    value={item.type}
                                    onChange={(event) => handleChangeIdType(item, event.target.value)}>
                                    {appConfig?.inventory?.customIdTypes?.map(type => (
                                        <option value={type}>{getCustomIdTypeLabel(type)}</option>
                                    ))}
                                </Form.Select>

                                <Form.Control
                                    className="me-1"
                                    value={item.rule ?? ''}
                                    onChange={(event) => handleChangeIdRule(item, event.target.value)} />

                                <div className="custom-id-btn-delete" onClick={() => handleDeleteItemClick(item)}>
                                    <MdDeleteOutline size='24px' color="#c44512" />
                                </div>
                            </div>

                        </Reorder.Item>
                    })}
                </Reorder.Group>
            </Form>
            {items.current.size < MAX_ID_COUNT && (
                <Button
                    variant='outline-primary'
                    className='me-2'
                    onClick={handleAddItemClick}>
                    <MdAdd /> Add ID
                </Button>
            )}
            <AppToastContainer />
        </Col>
    </Container>
}
