import { Button, Col, Form, Table } from "react-bootstrap";
import { formatRelative } from "date-fns";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import type { Inventory } from "api/inventory/inventory.types";
import { useTranslation } from "react-i18next";
import { ru, enUS } from 'date-fns/locale';

interface InventoryTableProps {
    title?: string;
    inventories?: Inventory[];
}

export enum InventoryTableColumn {
    CHECKBOX,
    TITLE,
    IMAGE,
    DESCRIPTION,
    CATEGORY,
    AUTHOR,
    ITEM_COUNT,
    CREATED_AT,
    UPDATED_AT
}

function createColumn(t: (s: string) => string, column: InventoryTableColumn) {
    switch (column) {
        case InventoryTableColumn.CHECKBOX:
            return <th key={column}><Form.Check /></th>;

        case InventoryTableColumn.TITLE:
            return <th key={column}>{t('inventory.tableColumns.title')}</th>;

        case InventoryTableColumn.IMAGE:
            return <th key={column}>{t('inventory.tableColumns.image')}</th>;

        case InventoryTableColumn.DESCRIPTION:
            return <th key={column}>{t('inventory.tableColumns.description')}</th>;

        case InventoryTableColumn.CATEGORY:
            return <th key={column}>{t('inventory.tableColumns.category')}</th>;

        case InventoryTableColumn.AUTHOR:
            return <th key={column}>{t('inventory.tableColumns.author')}</th>;

        case InventoryTableColumn.ITEM_COUNT:
            return <th key={column}>{t('inventory.tableColumns.itemCount')}</th>;

        case InventoryTableColumn.CREATED_AT:
            return <th key={column}>{t('inventory.tableColumns.createdAt')}</th>;

        case InventoryTableColumn.UPDATED_AT:
            return <th key={column}>{t('inventory.tableColumns.updatedAt')}</th>;
    }
}

function createRow(
    columns: InventoryTableColumn[],
    inventory: Inventory,
    onClick: () => void,
    onAuthorClick: () => void,
): ReactNode {
    return <tr
        key={inventory.id.toString()}
        onClick={onClick}
        role="button"
        tabIndex={0}>{
            columns.map((column) => {
                switch (column) {
                    case InventoryTableColumn.CHECKBOX:
                        return <td key={column}><Form.Check /></td>;

                    case InventoryTableColumn.TITLE:
                        return <td key={column}>{inventory.title}</td>;

                    case InventoryTableColumn.IMAGE:
                        if (inventory.imageLink) {
                            return <td key={column}><img src={inventory.imageLink} alt='Inventory image' width={100} height={100} /></td>;
                        }
                        return <td key={column}></td>;

                    case InventoryTableColumn.DESCRIPTION:
                        return <td key={column}>{inventory.description}</td>;

                    case InventoryTableColumn.CATEGORY:
                        return <td key={column}>{inventory.category?.name}</td>

                    case InventoryTableColumn.AUTHOR:
                        return <td key={column}>
                            <Button
                                variant="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAuthorClick();
                                }}>
                                {inventory.owner?.name}
                            </Button>
                        </td>

                    case InventoryTableColumn.ITEM_COUNT:
                        return <td key={column}>{inventory.itemCount}</td>

                    case InventoryTableColumn.CREATED_AT:
                        return <td key={column}>{formatRelative(inventory.createdAt, new Date(), { locale: ru })}</td>

                    case InventoryTableColumn.UPDATED_AT:
                        return <td key={column}>{formatRelative(inventory.updatedAt, new Date(), { locale: ru })}</td>
                }
            })
        }</tr>
}

const columns = [
    InventoryTableColumn.IMAGE,
    InventoryTableColumn.TITLE,
    InventoryTableColumn.DESCRIPTION,
    InventoryTableColumn.AUTHOR,
    InventoryTableColumn.CATEGORY,
    InventoryTableColumn.ITEM_COUNT,
    InventoryTableColumn.CREATED_AT
];

export function InventoryTable({ title, inventories }: InventoryTableProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return <Col>
        {title && <h4>{title}</h4>}

        <Table hover responsive>
            <thead>
                <tr>
                    {columns && columns.map(col => createColumn(t, col))}
                </tr>
            </thead>
            <tbody>
                {inventories && inventories.map((inventory) => createRow(
                    columns,
                    inventory,
                    () => navigate(`/inventory/${inventory.id}`),
                    () => navigate(`/user/${inventory.owner?.id}`)
                ))}

                {(!inventories || inventories.length === 0) && <p className="mt-3">{t('inventory.noData')}</p>}

            </tbody>
        </Table>
    </Col>;
}