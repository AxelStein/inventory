import inventoryService from '../inventory/inventory.service.js';
import dropboxService from '../dropbox/dropbox.service.js';
import { generateRandomNumberForCustomId } from '../inventory/custom_id/custom.id.random.number.generator.js';
import CustomIdType from '../inventory/custom_id/custom.id.type.js';

const service = {

    createTicket: async (user, data) => {
        const ticket = {
            reportedBy: user.email,
            link: data.link,
            priority: data.priority,
            admins: ['diefaust1993@gmail.com']
        };
        if (data.inventoryId) {
            const inventory = await inventoryService.getById({ id: data.inventoryId });
            ticket.inventory = inventory?.title;
        }
        const ticketNum = generateRandomNumberForCustomId(CustomIdType.RND_20_BIT);
        await dropboxService.upload(`/support-ticket-${ticketNum}.json`, JSON.stringify(ticket));
    }
}

export default service;