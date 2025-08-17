import CustomIdType from "./custom.id.type.js";
import crypto from "crypto";

export const generateRandomNumberForCustomId = (type) => {
    switch (type) {
        case CustomIdType.RND_20_BIT:
            return crypto.randomInt(0xFFFFF + 1);

        case CustomIdType.RND_32_BIT:
            return crypto.randomInt(0xFFFFFFFF + 1);

        case CustomIdType.RND_6_DIGIT:
            return crypto.randomInt(100_000, 1_000_000);

        case CustomIdType.RND_9_DIGIT:
            return crypto.randomInt(100_000_000, 1_000_000_000);

        default:
            throw new Error("Invalid type");
    }
}