import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();

		const config = {
			header: {
				"Content-Type": "application/json",
			},
		};

		if (password !== confirmPassword) {
			setPassword("");
			setConfirmPassword("");
			setTimeout(() => {
				setError("");
			}, 5000);
			return setError("Passwords do not match");
		}

		try {
			const { data } = await axios.post(
				"/auth",
				{ name, email, password },
				config
			);

			localStorage.setItem("token", data.token);
			window.location.reload();
			navigate("/profile");
		} catch (err) {
			const errors = err.response.data.errors;

			if (errors) {
				errors.forEach((error) => setError(error.msg));
				setTimeout(() => {
					setError("");
				}, 5000);
			}
		}
	};

	const googleLogin = () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};

	const facebookLogin = () => {
		window.open("http://localhost:5000/auth/facebook", "_self");
	};

	const githubLogin = () => {
		window.open("http://localhost:5000/auth/github", "_self");
	};

	return (
		<section className="registerScreen">
			<div className="registerScreenWrapper">
				<h2 className="title">Please Choose your Login/Register method</h2>
				{error && <span className="error">{error}</span>}
				<form onSubmit={submitHandler}>
					<div className="form-group">
						<label htmlFor="fullName">Name</label>
						<input
							type="text"
							name="fullName"
							placeholder="Full Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
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

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							value={confirmPassword}
							placeholder="Confirm Password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<div className="already">
						<button className="auth-btn" type="submit">
							Register
						</button>
						<span>
							Already have an account?<Link to="/login">Login</Link>
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

export default RegisterScreen;
