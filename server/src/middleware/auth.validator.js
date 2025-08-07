import passport from "passport";

const authValidator = () => passport.authenticate('jwt', { session: false });

export default authValidator;