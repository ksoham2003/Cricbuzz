import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import env from "../config/env.js";

export default function googleOAuthMiddleware(app) {
    app.use(passport.initialize());

    passport.use(new GoogleStrategy({
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
        const userProfile = {
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            name: profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : "Google User"),
            googleId: profile.id
        };
        return done(null, userProfile);
    }))
}
