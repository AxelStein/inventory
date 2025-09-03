import Tag from "./tag.model.js";
import Inventory from "../inventory.model.js";
import { NotFoundError } from "../../error/index.js";
import { Sequelize } from "sequelize";

const repository = {

    getFromInventory: async (inventoryId) => {
        const inventory = await Inventory.findByPk(inventoryId, {
            include: [{
                association: 'tags',
                through: {
                    attributes: []
                }
            }],
        });
        return inventory.tags;
    },

    getList: () => Tag.findAll({
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM inventory_tags_embedded
                        WHERE "tagId" = "InventoryTag"."id"
                    )`),
                    'inventoryCount'
                ]
            ]
        }
    }),

    create: async (inventoryId, name) => {
        const inventory = await Inventory.findByPk(inventoryId);
        const [tag] = await Tag.findOrCreate({ where: { name } });
        await inventory.addTag(tag);
        return tag;
    },

    delete: async (id, inventoryId) => {
        const inventory = await Inventory.findByPk(inventoryId);
        const tag = await Tag.findByPk(id);
        if (!tag) {
            throw new NotFoundError(__('tag.error.notFound'));
        }
        await inventory.removeTag(tag);
    }
}

export default repository;