import {Col, Form, Table} from "react-bootstrap";
import {MdPrivacyTip, MdPublic} from "react-icons/md";
import type {InventoryApiModel} from "../../../api/inventory/inventory.api.model";
import {formatRelative} from "date-fns";

interface InventoryTableProps {
    title?: string;
    columns?: InventoryTableColumn[];
    inventories?: InventoryApiModel[];
}

export enum InventoryTableColumn {
    CHECKBOX,
    TITLE,
    IMAGE,
    DESCRIPTION,
    CATEGORY,
    AUTHOR,
    CREATED_AT,
    UPDATED_AT
}

function createColumn(column: InventoryTableColumn) {
    switch (column) {
        case InventoryTableColumn.CHECKBOX:
            return <td><Form.Check/></td>;

        case InventoryTableColumn.TITLE:
            return <th>Title</th>;

        case InventoryTableColumn.IMAGE:
            return <th>Image</th>;

        case InventoryTableColumn.DESCRIPTION:
            return <th>Description</th>;

        case InventoryTableColumn.CATEGORY:
            return <th>Category</th>;

        case InventoryTableColumn.AUTHOR:
            return <th>Author</th>;

        case InventoryTableColumn.CREATED_AT:
            return <th>Created at</th>;

        case InventoryTableColumn.UPDATED_AT:
            return <th>Updated at</th>;
    }
}

function createRow(columns: InventoryTableColumn[], inventory: InventoryApiModel): any {
    columns.map((column) => {
        switch (column) {
            case InventoryTableColumn.CHECKBOX:
                return <td><Form.Check/></td>;

            case InventoryTableColumn.TITLE:
                return <td>{inventory.title}</td>;

            case InventoryTableColumn.IMAGE:
                return <td><img src={inventory.imageLink} alt='Inventory image'/></td>;

            case InventoryTableColumn.DESCRIPTION:
                return <td>{inventory.description}</td>;

            case InventoryTableColumn.CATEGORY:
                return <td>{inventory.category?.name}</td>

            case InventoryTableColumn.AUTHOR:
                return <td>{inventory.owner?.name}</td>

            case InventoryTableColumn.CREATED_AT:
                return <td>{formatRelative(inventory.createdAt, new Date())}</td>

            case InventoryTableColumn.UPDATED_AT:
                return <td>{formatRelative(inventory.updatedAt, new Date())}</td>

        }
    });
}

export function InventoryTable({title, columns, inventories} : InventoryTableProps) {
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