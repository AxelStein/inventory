import jsforce from '@jsforce/jsforce-node';
import { mapAccount, mapAccountData, mapContactData } from './salesforce.mapper.js';
import userService from '../user/user.service.js';
import { NotFoundError } from '../error/index.js';

const conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
});
await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);

const service = {

    getAccountById: async (accountId) => {
        const result = await conn.query(`
            SELECT Id, Name, Phone, Industry, Website,
                (SELECT Id, FirstName, LastName, Email FROM Contacts)
            FROM Account
            WHERE Id = '${accountId}'
        `);
        if (result.records.length === 0) {
            throw new NotFoundError();
        }
        return mapAccount(result.records[0]);
    },

    getAccountByUser: async (userId) => {
        const user = await userService.getById(userId);
        if (!user.salesforceAccountId) {
            throw new NotFoundError();
        }
        return await service.getAccountById(user.salesforceAccountId);
    },

    createAccount: async (data) => {
        const { userId, contacts, ...accountData } = data;
        const accountId = await service._createAccount(accountData);
        await userService.setSaleforceAccountId(userId, accountId);
        await service._createContacts(accountId, contacts);
        return service.getAccountByUser(userId);
    },

    _createAccount: async (accountData) => {
        const result = await conn.sobject("Account").create(mapAccountData(accountData));
        if (result.success === true) {
            return result.id;
        } else {
            throw new Error(result.errors[0].message);
        }
    },

    _createContacts: async (accountId, contacts) => {
        if (!contacts || contacts.length === 0) return;
        await conn.sobject("Contact")
            .createBulk(
                contacts.map(contact => mapContactData(contact, accountId))
            );
    }
}

export default service;