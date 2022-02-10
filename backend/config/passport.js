const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "http://mernauthapp101.herokuapp.com/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				const userExist = await User.findOne({ socialID: profile.id });

				if (userExist) {
					return done(null, userExist);
				} else {
					const newUser = new User({
						name: profile.displayName,
						socialID: profile.id,
						email: profile.email,
						avatar: profile.photos[0].value,
						registrationType: "google",
					});

					await newUser.save();
					done(null, newUser);
				}
			}
		)
	);

	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: "http://mernauthapp101.herokuapp.com/auth/github/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				const userExist = await User.findOne({ socialID: profile.id });

				if (userExist) {
					return done(null, userExist);
				} else {
					const newUser = new User({
						name: profile.displayName,
						socialID: profile.id,
						avatar: profile.photos[0].value,
						email: profile.email,
						registrationType: "github",
					});

					await newUser.save();
					done(null, newUser);
				}
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_APP_ID,
				clientSecret: process.env.FACEBOOK_APP_SECRET,
				callbackURL:
					"http://mernauthapp101.herokuapp.com/auth/facebook/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				const userExist = await User.findOne({ socialID: profile.id });

				if (userExist) {
					return done(null, userExist);
				} else {
					const newUser = new User({
						name: profile.displayName,
						socialID: profile.id,
						avatar: profile.photos[0].value,
						email: profile.email,
						registrationType: "facebook",
					});

					await newUser.save();
					done(null, newUser);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};
