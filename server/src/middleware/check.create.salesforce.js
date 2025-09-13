import UserRole from "../user/user.role.js";

export const checkCreateSalesforceAccount = () => (req, res, next) => {
    if (req.user.role === UserRole.ADMIN || req.user.id === req.body.userId) {
        next();
    } else {
        throw new ForbiddenError();
    }
}