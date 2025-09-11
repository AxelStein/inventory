import jsforce from '@jsforce/jsforce-node';
import { mapAccount } from './salesforce.mapper.js';
import userService from '../user/user.service.js';
import { NotFoundError } from '../error/index.js';

const conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
});
await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);

const service = {

    getAccount: async (userId) => {
        const user = await userService.getById(userId);
        if (!user.salesforceAccountId) {
            throw new NotFoundError();
        }
        const result = await conn.query(`
            SELECT Id, Name, Phone, Industry, Website,
                (SELECT Id, FirstName, LastName, Email FROM Contacts)
            FROM Account
            WHERE Id = ${user.salesforceAccountId}
        `);
        if (result.records.length === 0) {
            throw new NotFoundError();
        }
        return mapAccount(result.records[0]);
    },

    createAccount: async (userId, data) => {
        const { contacts, accountData } = data;
        const accountId = await service._createAccount(accountData);
        await userService.setSaleforceAccountId(userId, accountId);
        await service._createContacts(accountId, contacts);
        return getAccountById(accountId);
    },

    _createAccount: async (accountData) => {
        const results = await conn.sobject("Account").create(accountData);
        const result = results[0];
        if (result.success === true) {
            return result.id;
        } else {
            throw new Error(result.errors[0].message);
        }
    },

    _createContacts: async (accountId, contacts) => {
        if (!contacts || contacts.length === 0) return;
        contacts.forEach(contact => contact.AccountId = accountId);
        await conn.sobject("Contact").createBulk(contacts);
    }
}

export default service;