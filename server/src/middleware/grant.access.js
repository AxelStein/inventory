import control from "../access.control.js";
import { ForbiddenError } from "../error/index.js";

const grantAccess = (action, resource) => async (req, res, next) => {
    if (role && control.can(req.user.role)[action](resource).granted) {
        next();
    } else {
        throw new ForbiddenError();
    }
}

export default grantAccess;