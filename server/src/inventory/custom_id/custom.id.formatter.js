import {trimString} from "../../util/string.util.js";
import CustomIdType from "./custom.id.type.js";
import crypto from "crypto";
import {format} from "date-fns";
import {generateRandomNumberForCustomId} from "./custom.id.random.number.generator.js";

export const formatCustomId = (customId) => {
    const rule = trimString(customId.rule);

    switch (customId.type) {
        case CustomIdType.FIXED:
            if (rule.length === 0) {
                throw new Error('Fixed custom id part must have a rule');
            }
            return rule;

        case CustomIdType.GUID:
            const uuid = crypto.randomUUID();
            return rule.replace(/{uid}/gi, uuid) || uuid;

        case CustomIdType.DATE_TIME:
            return format(new Date(), rule || 'dd.MM.yyyy');

        case CustomIdType.SEQUENCE:
            if (!customId.nextSequence) {
                throw new Error('Sequence custom id part must have a nextSequence');
            }
            const regex = /\{num}/gi;
            const padRegex = /\{num,(\d+)}/gi;
            const num = customId.nextSequence;
            if (!rule) return num.toString();
            return rule
                .replace(padRegex, (match, n) => num.toString().padStart(n || 0, '0'))
                .replace(regex, num.toString());

        default:
            const number = generateRandomNumberForCustomId(customId.type);
            const hex = number.toString(16);
            return rule.replace(/{num}/gi, number.toString())
                .replace(/{hex}/gi, hex);
    }
};