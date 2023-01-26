import { login } from "./login";
import { logout } from "./logout";
import { prisma } from "../../config/db";
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from "../../config/env";
import { validate_email } from "./validate_email";

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    const token = await prisma.token.findUnique({
        where: {
            id: jwt_payload.tokenId
        }
    });

    if (token) {
        return done(null, token);
    } else {
        return done(null, false);
    }
}));

export const auth = {
    login,
    logout,
    validate_email
};