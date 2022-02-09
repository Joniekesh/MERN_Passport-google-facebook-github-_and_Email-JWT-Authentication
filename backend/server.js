require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
require("./config/passport")(passport);
const cors = require("cors");
const path = require("path");

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());

app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: ["123abc"],
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

//APIS
app.use("/auth", authRoutes);
const _dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(_dirname, "/frontend/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`SERVER running in ${process.env.NODE_ENV} MODE on PORT ${PORT}`)
);
