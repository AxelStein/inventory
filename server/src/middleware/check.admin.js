import { ForbiddenError } from "../error/index.js";
import UserRole from '../user/user.role.js';

const checkIsAdmin = (action, resource) => async (req, res, next) => {
    if (req.user.role === UserRole.ADMIN) {
        next();
    } else {
        throw new ForbiddenError();
    }
}

export default checkIsAdmin;