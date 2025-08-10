import { literal } from 'sequelize';
import Inventory from './inventory.model.js';
import { ConfictError } from '../error/index.js';

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({ where: { id }, include: 'writeAccess' }),

    getList: () => Inventory.findAll(),

    create: (data) => Inventory.create(data),

    update: async (id, data) => {
        const [rows] = await Inventory.update({
            ...data,
            version: literal('version + 1'),
        }, {
            where: {
                id,
                version: data.version,
            }
        });
        if (rows === 0) {
            throw new ConfictError();
        }
    }
}

export default repository;