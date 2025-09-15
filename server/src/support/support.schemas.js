import Joi from "joi";
import SupportTicketPriority from "./support.ticket.priority.js";

export const createSupportTicketSchema = Joi.object({
    link: Joi.string().uri({
        scheme: ['http', 'https']
    }).required(),
    priority: Joi.string().valid(...Object.values(SupportTicketPriority)).required(),
    inventoryId: Joi.number().integer(),
    summary: Joi.string().required(),
}).required();