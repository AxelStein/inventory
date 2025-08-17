import { NotFoundError } from "../error/index.js";
import { inflateInventoryCustomFields } from "./inventory.custom.field.js";

export const mapInventory = (inventory) => {
    if (!inventory) {
        throw new NotFoundError();
    }
    const r = {
        id: inventory.id,
        title: inventory.title,
        description: inventory.description,
        imageLink: inventory.imageLink,
        isPublic: inventory.isPublic,
        owner: inventory.owner,
        category: inventory.category,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
        writeAccess: inventory.writeAccess,
        version: inventory.version,
        fields: []
    };

    inflateInventoryCustomFields((prefix, field) => {
        const name = inventory[`${prefix}Name`];
        if (name) {
            r.fields.push({
                uid: prefix,
                name,
                description: inventory[`${prefix}Description`],
                state: inventory[`${prefix}State`],
                type: field.type,
            });
        }
    });
    return r;
}

export const mapInventoryList = (list) => list.map((item) => mapInventory(item))