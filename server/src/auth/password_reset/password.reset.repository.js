import PasswordReset from './password.reset.model.js';
import { Transaction } from 'sequelize';

const repository = {

    delete: (userId, transaction = null) => PasswordReset.destroy({ where: { userId }, transaction }),

    create: (data, transaction = null) => PasswordReset.create(data, { transaction, raw: true }),

    get: (token, transaction = null) => PasswordReset.findOne({ where: { token }, transaction, raw: true })
}

export default repository;