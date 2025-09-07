import { Reorder } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { InventoryContext } from "../InventoryPage";
import { Button, Col, Container, Form, Tooltip } from "react-bootstrap";
import { MdAdd, MdDeleteOutline, MdDragIndicator, MdHelpOutline } from "react-icons/md";
import { useGetAppConfigQuery } from "api/app/app.api";
import { CustomIdType } from "api/app/app.types";
import { useCreateCustomIdMutation, useDeleteCustomIdMutation, useGetCustomIdsQuery, usePreviewCustomIdQuery, useReorderCustomIdsMutation, useUpdateCustomIdMutation } from "api/custom_id/custom.id.api";
import type { InventoryCustomId } from "api/custom_id/custom.id.types";
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import AppToastContainer from "~/components/AppToastContainer";
import { useTranslation } from "react-i18next";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import type { TFunction } from "i18next";
import { useErrorFormatter } from "~/components/error.formatter";

const getCustomIdTypeLabel = (type: CustomIdType, t: TFunction): string => {
    switch (type) {
        case CustomIdType.FIXED:
            return t('customId.labels.fixed');

        case CustomIdType.RND_20_BIT:
            return t('customId.labels.rnd20bit');

        case CustomIdType.RND_32_BIT:
            return t('customId.labels.rnd32bit');

        case CustomIdType.RND_6_DIGIT:
            return t('customId.labels.rnd6digit');

        case CustomIdType.RND_9_DIGIT:
            return t('customId.labels.rnd9digit');

        case CustomIdType.GUID:
            return t('customId.labels.guid');

        case CustomIdType.DATE_TIME:
            return t('customId.labels.dateTime');

        case CustomIdType.SEQUENCE:
            return t('customId.labels.sequence');
    }
}

const MAX_ID_COUNT = 10;

export default function CustomIdPage() {
    const { data: appConfig } = useGetAppConfigQuery();
    const { inventory } = useContext(InventoryContext);
    const { data: customIdsQuery } = useGetCustomIdsQuery(inventory?.id ?? 0, { skip: !inventory });
    const { formatError } = useErrorFormatter();
    const [createItem] = useCreateCustomIdMutation();
    const [updateItem] = useUpdateCustomIdMutation();
    const [deleteItem] = useDeleteCustomIdMutation();
    const [reorderItems] = useReorderCustomIdsMutation();
    const { data: preview, refetch: refreshPreview } = usePreviewCustomIdQuery(inventory?.id ?? 0, { skip: !inventory });
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
        toast.error(formatError(err));
    }

    const updateItemCallback = (newItem: InventoryCustomId) => {
        resetItem(newItem);
        refreshPreview();
    }

    const resetItem = (newItem: InventoryCustomId) => {
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
        }).unwrap().then(updateItemCallback);
    }

    const handleChangeIdRule = (item: InventoryCustomId, rule: string) => {
        resetItem({ ...item, rule });

        debounceMap.current.get(item.id)?.cancel();
        const d = debounce(() => {
            const it = items.current?.get(item.id);
            if (it) {
                updateItem(it).unwrap().then(updateItemCallback);
            }
        }, 1500);
        debounceMap.current.set(item.id, d);
        d();
    }

    const handleAddItemClick = () => {
        createItem({ inventoryId: inventory!.id, type: CustomIdType.SEQUENCE })
            .unwrap()
            .then(updateItemCallback)
            .catch(handleError);
    }

    const handleDeleteItemClick = (item: InventoryCustomId) => {
        deleteItem(item.id)
            .unwrap()
            .then(() => {
                items.current?.delete(item.id);
                setIds(ids.filter((id) => id !== item.id));
                refreshPreview();
            })
            .catch(handleError);
    }

    const handleDragEnd = () => {
        reorderItems({
            inventoryId: inventory!.id,
            customIds: ids,
        }).unwrap().catch(handleError);
    }

    const createTooltip = (item: InventoryCustomId) => {
        switch (item.type) {
            case CustomIdType.FIXED:
                return t('customId.tooltips.fixed');

            case CustomIdType.SEQUENCE:
                return t('customId.tooltips.sequence');

            case CustomIdType.DATE_TIME:
                return t('customId.tooltips.dateTime');

            case CustomIdType.GUID:
                return t('customId.tooltips.guid');

            case CustomIdType.RND_6_DIGIT:
                return t('customId.tooltips.rnd6digit');

            case CustomIdType.RND_9_DIGIT:
                return t('customId.tooltips.rnd9digit');

            case CustomIdType.RND_20_BIT:
                return t('customId.tooltips.rnd20bit');

            case CustomIdType.RND_32_BIT:
                return t('customId.tooltips.rnd32bit');
        }
    }

    return <Container className="d-flex justify-content-center">
        <Col md={6}>
            {preview && (<h5 className="mb-3">{t('customId.example')} {preview}</h5>)}
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
                                        <option value={type}>{getCustomIdTypeLabel(type, t)}</option>
                                    ))}
                                </Form.Select>

                                <Form.Control
                                    className="me-1"
                                    value={item.rule ?? ''}
                                    onChange={(event) => handleChangeIdRule(item, event.target.value)} />

                                <OverlayTrigger
                                    placement="top"
                                    container={document.body}
                                    overlay={<Tooltip>{createTooltip(item)}</Tooltip>}>
                                    <div className="custom-id-btn-help">
                                        <MdHelpOutline size='24px' />
                                    </div>
                                </OverlayTrigger>


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
                    <MdAdd /> {t('customId.btnAdd')}
                </Button>
            )}
        </Col>
    </Container>
}
