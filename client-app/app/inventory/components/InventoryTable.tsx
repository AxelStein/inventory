import { Button, Col, Form, Table } from "react-bootstrap";
import { formatRelative } from "date-fns";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import type { Inventory } from "api/inventory/inventory.types";
import { useTranslation } from "react-i18next";
import { ru, enUS } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import TableDateData from "~/components/TableDateData";
import type { TFunction } from "i18next";

interface InventoryTableProps {
    title?: string | null;
    inventories?: Inventory[];
    handleColumnClick?: (column: string) => void;
    renderSortIndicator?: (column: string) => void;
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

function createColumn(
    t: TFunction,
    column: InventoryTableColumn,
    handleColumnClick?: (column: string) => void,
    renderSortIndicator?: (column: string) => void,
) {
    switch (column) {
        case InventoryTableColumn.CHECKBOX:
            return <th key={column}><Form.Check /></th>;

        case InventoryTableColumn.TITLE:
            return <th
                key={column}
                onClick={() => handleColumnClick?.('title')}>
                {t('inventory.tableColumns.title')} {renderSortIndicator?.('title') ?? ''}
            </th>;

        case InventoryTableColumn.IMAGE:
            return <th key={column}>{t('inventory.tableColumns.image')}</th>;

        case InventoryTableColumn.DESCRIPTION:
            return <th key={column}>{t('inventory.tableColumns.description')}</th>;

        case InventoryTableColumn.CATEGORY:
            return <th
                key={column}
                onClick={() => handleColumnClick?.('categoryId')}>
                {t('inventory.tableColumns.category')} {renderSortIndicator?.('categoryId') ?? ''}
            </th>;

        case InventoryTableColumn.AUTHOR:
            return <th key={column}>{t('inventory.tableColumns.author')}</th>;

        case InventoryTableColumn.ITEM_COUNT:
            return <th
                key={column}
                onClick={() => handleColumnClick?.('itemCount')}>
                {t('inventory.tableColumns.itemCount')} {renderSortIndicator?.('itemCount') ?? ''}
            </th>;

        case InventoryTableColumn.CREATED_AT:
            return <th
                key={column}
                onClick={() => handleColumnClick?.('createdAt')}>
                {t('inventory.tableColumns.createdAt')} {renderSortIndicator?.('createdAt') ?? ''}
            </th>;

        case InventoryTableColumn.UPDATED_AT:
            return <th
                key={column}
                onClick={() => handleColumnClick?.('updatedAt')}>
                {t('inventory.tableColumns.updatedAt')} {renderSortIndicator?.('updatedAt') ?? ''}
            </th>;
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
        onClick={(event) => {
            const target = event.target as Element;
            if (!target.closest('.no-row-click')) {
                onClick();
            }
        }}
        role="button"
        tabIndex={0}>{
            columns.map((column) => {
                switch (column) {
                    case InventoryTableColumn.CHECKBOX:
                        return <td key={column} className="no-row-click"><Form.Check /></td>;

                    case InventoryTableColumn.TITLE:
                        return <td key={column}>{inventory.title}</td>;

                    case InventoryTableColumn.IMAGE:
                        if (inventory.imageLink) {
                            return <td key={column}>
                                <img
                                    className='inventory-image-preview'
                                    src={inventory.imageLink}
                                    alt='Inventory image' />
                            </td>;
                        }
                        return <td key={column}></td>;

                    case InventoryTableColumn.DESCRIPTION:
                        return <td key={column}><ReactMarkdown>{inventory.description}</ReactMarkdown></td>;

                    case InventoryTableColumn.CATEGORY:
                        return <td key={column}>{inventory.category?.name}</td>

                    case InventoryTableColumn.AUTHOR:
                        return <td key={column}>
                            <span
                                className="author-link no-row-click"
                                onClick={onAuthorClick}>
                                {inventory.owner?.name}
                            </span>
                        </td>

                    case InventoryTableColumn.ITEM_COUNT:
                        return <td key={column}>{inventory.itemCount}</td>

                    case InventoryTableColumn.CREATED_AT:
                        return <td key={column}><TableDateData date={inventory.createdAt} /></td>

                    case InventoryTableColumn.UPDATED_AT:
                        return <td key={column}><TableDateData date={inventory.updatedAt} /></td>
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

export function InventoryTable({ title, inventories, handleColumnClick, renderSortIndicator }: InventoryTableProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return <Col>
        {title && <h4>{title}</h4>}

        {(!inventories || inventories.length === 0) ? (
            <p className="no-data">{t('inventory.noData')}</p>
        ) : (
            <Table hover responsive>
                <thead>
                    <tr>
                        {columns && columns.map(col => createColumn(t, col, handleColumnClick, renderSortIndicator))}
                    </tr>
                </thead>
                <tbody>
                    {inventories && inventories.map((inventory) => createRow(
                        columns,
                        inventory,
                        () => navigate(`/inventory/${inventory.id}`),
                        () => navigate(`/user/${inventory.owner?.id}`)
                    ))}

                </tbody>
            </Table>
        )}
    </Col>;
}