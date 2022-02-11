import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();

		const config = {
			header: {
				"Content-Type": "application/json",
			},
		};

		try {
			const { data } = await axios.post(
				"/auth/login",
				{ email, password },
				config
			);

			localStorage.setItem("token", data.token);
			window.location.reload();
			navigate("/profile");
		} catch (err) {
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((err) => setError(err.msg));

				setTimeout(() => {
					setError("");
				}, 5000);
			}
		}
	};

	const googleLogin = () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};

	const githubLogin = () => {
		window.open("http://localhost:5000/auth/github", "_self");
	};

	const facebookLogin = () => {
		window.open("http://localhost:5000/auth/facebook", "_self");
	};

	return (
		<section className="registerScreen">
			<div className="registerScreenWrapper">
				<h2 className="title">Please Choose your Login/Register method</h2>
				{error && <span className="error">{error}</span>}
				<form onSubmit={submitHandler}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className="already">
						<button className="auth-btn" type="submit">
							Login
						</button>
						<span>
							Don't have an account?<Link to="/register">Register</Link>
						</span>
					</div>
				</form>
				<div className="divider">
					<div className="or">OR</div>
				</div>
				<div className="social-login">
					<div className="googleBtn" onClick={googleLogin}>
						Login with Google+
					</div>
					<div className="facebookBtn" onClick={facebookLogin}>
						Login with FaceBook
					</div>
					<div className="githubBtn" onClick={githubLogin}>
						Login with Github
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginScreen;
