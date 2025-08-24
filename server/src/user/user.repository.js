import User from './user.model.js';
import {Op, Sequelize} from "sequelize";
import {createSortOrder} from "../db/sort.order.js";

const repository = {

    getVerified: (where, transaction = null, lock = null) => User.findOne({
        where: { ...where, isBlocked: false, verified: true },
        transaction,
        lock
    }),

    getNotBlocked: (id, transaction = null) => User.findOne({
        where: { id, isBlocked: false },
        transaction,
    }),

    search: ({ q, sortBy, sortAsc, page, perPage }) => User.getPage(page, perPage, {
        where: Sequelize.where(
            Sequelize.fn('to_tsquery', 'english', `${q}:*`),
            '@@',
            Sequelize.col('searchVector'),
        ),
        order: createSortOrder(sortBy, sortAsc),
    }),

    getList: ({ sortBy, sortAsc, page, perPage }) => User.getPage(page, perPage, {
        order: createSortOrder(sortBy, sortAsc),
    }),

    updateLastSeenDate: (id) => User.update({ lastSeen: new Date() }, { where: { id } }),

    updateUserPassword: (userId, password, transaction = null) => User.update(
        { password },
        { where: { id: userId }, transaction }
    ),

    getByEmail: (email, transaction = null) => User.findOne({
        attributes: { include: ['password'] },
        where: { email, isBlocked: false },
        transaction
    }),

    create: (data, transaction = null) => User.create(data, { transaction }),

    blockByIds: (ids, block, transaction = null) => User.update({ isBlocked: block }, {
        where: { id: { [Op.in]: ids } },
        transaction,
    }),

    deleteByIds: (ids, transaction = null) => User.destroy({
        where: { id: { [Op.in]: ids } },
        transaction
    }),

    changeRoleByIds: (ids, role, transaction = null) => User.update({ role }, {
        where: { id: { [Op.in]: ids } },
        transaction
    }),
}

export default repository;