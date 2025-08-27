import {Col, Form, Table} from "react-bootstrap";
import {formatRelative} from "date-fns";
import type {ReactNode} from "react";
import {Link} from "react-router";
import type {Inventory} from "../../../api/types";

interface InventoryTableProps {
    title?: string;
    columns?: InventoryTableColumn[];
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

function createColumn(column: InventoryTableColumn) {
    switch (column) {
        case InventoryTableColumn.CHECKBOX:
            return <th key={column}><Form.Check/></th>;

        case InventoryTableColumn.TITLE:
            return <th key={column}>Title</th>;

        case InventoryTableColumn.IMAGE:
            return <th key={column}>Image</th>;

        case InventoryTableColumn.DESCRIPTION:
            return <th key={column}>Description</th>;

        case InventoryTableColumn.CATEGORY:
            return <th key={column}>Category</th>;

        case InventoryTableColumn.AUTHOR:
            return <th key={column}>Author</th>;

        case InventoryTableColumn.ITEM_COUNT:
            return <th key={column}>Item count</th>;

        case InventoryTableColumn.CREATED_AT:
            return <th key={column}>Created at</th>;

        case InventoryTableColumn.UPDATED_AT:
            return <th key={column}>Updated at</th>;
    }
}

function createRow(columns: InventoryTableColumn[], inventory: Inventory): ReactNode {
    return <tr key={inventory.id.toString()}>{
        columns.map((column) => {
            switch (column) {
                case InventoryTableColumn.CHECKBOX:
                    return <td key={column}><Form.Check/></td>;

                case InventoryTableColumn.TITLE:
                    return <td key={column}>{inventory.title}</td>;

                case InventoryTableColumn.IMAGE:
                    if (inventory.imageLink) {
                        return <td key={column}><img src={inventory.imageLink} alt='Inventory image' width={100} height={100}/></td>;
                    }
                    return <td key={column}></td>;

                case InventoryTableColumn.DESCRIPTION:
                    return <td key={column}>{inventory.description}</td>;

                case InventoryTableColumn.CATEGORY:
                    return <td key={column}>{inventory.category?.name}</td>

                case InventoryTableColumn.AUTHOR:
                    return <td key={column}><Link to={{pathname: `/user/${inventory.owner?.id}`}}> {inventory.owner?.name}</Link></td>

                case InventoryTableColumn.ITEM_COUNT:
                    return <td key={column}>{inventory.itemCount}</td>

                case InventoryTableColumn.CREATED_AT:
                    return <td key={column}>{formatRelative(inventory.createdAt, new Date())}</td>

                case InventoryTableColumn.UPDATED_AT:
                    return <td key={column}>{formatRelative(inventory.updatedAt, new Date())}</td>
            }
        })
    }</tr>

}

export function InventoryTable({title, columns, inventories}: InventoryTableProps) {
    return <Col>
        {title && <h4>{title}</h4>}

        <Table hover responsive>
            <thead>
            <tr>
                {columns && columns.map(createColumn)}
            </tr>
            </thead>
            <tbody>

            {columns && inventories && inventories.map((inventory) => createRow(columns, inventory))}

            </tbody>
        </Table>
    </Col>;
}