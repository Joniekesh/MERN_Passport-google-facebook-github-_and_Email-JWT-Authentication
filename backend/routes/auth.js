const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");

// @desc   Register User by Email
// @route  POST /auth
// @access Public
router.post(
	"/",
	[
		check("name", "Name is required").notEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			const user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User already exist" }] });
			}
			const newUser = new User({
				name,
				email,
				password,
			});
			const createdUser = await newUser.save();

			res.status(201).json({
				_id: createdUser._id,
				name: createdUser.name,
				email: createdUser.email,
				isAdmin: createdUser.isAdmin,
				token: generateToken(createdUser._id),
			});
		} catch (err) {
			console.error(err);
			res.status(400).send("Server Error");
		}
	}
);

// @desc   Login User by Email
// @route  POST /auth/login
// @access Public
router.post(
	"/login",
	[
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Password of not less than 6 characters is required"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}
			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				token: generateToken(user._id),
			});
		} catch (err) {
			console.error(err);
			res.status(400).send("Server Error ");
		}
	}
);

// @desc   Get logged in user profile
// @route  GET /api/auth
// @access Private
router.get("/me", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (user) {
			res.status(200).json({
				success: true,
				message: "Successful",
				user,
			});
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

// @desc   Passport Login Success
// @route  GET /auth/login/success
// @access Private
router.get("/login/success", (req, res) => {
	const user = req.user;
	if (user) {
		res.status(200).json({
			success: true,
			message: "successfull",
			user,
		});
	}
});

// @desc   Logout user
// @route  GET /auth/logout
// @access Private
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("http://localhost:3000");
});

// @desc  Passport-Google Authentication
// route  GET /auth/google
// access Public
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc   Passport-Google callback
// @route  GET /auth/google/callback
// @access Public
router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: "http://localhost:3000/profile",
		failureRedirect: "/login/fail",
	})
);

// @desc   Passport-Github Authentication
// @route  GET /auth/github
// @access Public
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// @desc   Passport-Github callback
// @route  GET /auth/github/callback
// @access Public
router.get(
	"/github/callback",
	passport.authenticate("github", {
		successRedirect: "http://localhost:3000/profile",
		failureRedirect: "/login/fail",
	})
);

// @desc   Passport-Facebook Authentication
// @route  GET /auth/facebook
// @access Public
router.get(
	"/facebook",
	passport.authenticate("facebook", { scope: ["profile"] })
);

// @desc   Passport-Facebook callback
// @route  GET /auth/facebook/callback
// @access Public
router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		successRedirect: "http://localhost:3000/profile",
		failureRedirect: "/login/fail",
	})
);

module.exports = router;
