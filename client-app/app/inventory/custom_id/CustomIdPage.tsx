import { Reorder, useDragControls } from "motion/react";
import { use, useContext, useEffect, useState } from "react";
import { InventoryContext } from "../InventoryPage";
import { Button, Col, Container, Form } from "react-bootstrap";
import { MdAdd, MdDragIndicator } from "react-icons/md";
import { useGetAppConfigQuery } from "api/app/app.api";
import { CustomIdType } from "api/app/app.types";
import { useGetCustomIdsQuery } from "api/custom_id/custom.id.api";
import type { InventoryCustomId } from "api/custom_id/custom.id.types";

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

export default function CustomIdPage() {
    const { data: appConfig } = useGetAppConfigQuery();
    const { inventory } = useContext(InventoryContext);
    const { data: customIdsQuery } = useGetCustomIdsQuery(inventory?.id ?? 0, { skip: !inventory });

    const [items, setItems] = useState<Map<number, InventoryCustomId>>();
    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        if (customIdsQuery) {
            setItems(new Map(customIdsQuery.map(item => [item.id, item])));
            setIds(customIdsQuery.map(item => item.id));
        }
    }, [customIdsQuery, setItems]);

    useEffect(() => {
        console.log(ids);
    }, [ids]);

    const controls = useDragControls();
    return <Container className="d-flex justify-content-center">
        <Col md={6}>
            <Form>
                <Reorder.Group
                    onReorder={setIds}
                    values={ids}
                    className="custom-id-group">

                    {ids.map(id => {
                        const item = items!.get(id)!;
                        // dragListener={false}
                        // dragControls={controls}
                        // onPointerDown={(e) => controls.start(e)}
                        return <Reorder.Item
                            key={id}
                            value={id}

                            className='mb-3'>

                            <div className="d-flex">
                                <MdDragIndicator
                                    className="me-3"
                                    size='48px'

                                />

                                <Form.Select className="me-3" value={item.type}>
                                    {appConfig?.inventory?.customIdTypes?.map(type => (
                                        <option value={type}>{getCustomIdTypeLabel(type)}</option>
                                    ))}
                                </Form.Select>

                                <Form.Control value={item.rule ?? ''} />
                            </div>

                        </Reorder.Item>
                    })}
                </Reorder.Group>
            </Form>
            <Button
                variant='outline-primary'
                className='me-2'>
                <MdAdd /> Add ID
            </Button>
        </Col>
    </Container>
}
