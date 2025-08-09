import passport from "passport";

const checkHasAuth = () => passport.authenticate('jwt', { session: false });

export default checkHasAuth;