import { login } from './login';
import { logout } from './logout';
import { prisma } from '../../config/db';
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from '../../config/env';
import { validate_email } from './validate_email';

// OAuth providers login routes
import { discord_oauth } from './oauth_providers/discord';
import { htb_config } from './oauth_providers/hackthebox';
import { get_oauth_tokens, google_oauth, get_oauth_url } from './oauth_providers/google';

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload);
    const token = await prisma.token.findFirst({
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
    discord_oauth,
    htb_config,
    get_oauth_tokens,
    google_oauth,
    get_oauth_url,
    login,
    logout,
    validate_email
};