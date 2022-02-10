import "./App.css";
import { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

function App() {
	const [user, setUser] = useState(null);

	const token = localStorage.getItem("token");

	useEffect(() => {
		const getUser = () => {
			if (!token) {
				fetch("http://mernauthapp101.herokuapp.com/auth/login/success", {
					method: "GET",
					credentials: "include",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
					},
				})
					.then((response) => {
						if (response.status === 200) return response.json();
						throw new Error("authentication has been failed!");
					})
					.then((resObject) => {
						setUser(resObject.user);
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				fetch("http://mernauthapp101.herokuapp.com/auth/me", {
					method: "GET",
					credentials: "include",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
					.then((response) => {
						if (response.status === 200) return response.json();
						throw new Error("authentication has been failed!");
					})
					.then((resObject) => {
						setUser(resObject.user);
					})
					.catch((error) => {
						localStorage.removeItem("token");
						console.log(error);
					});
			}
		};
		getUser();
	}, [token]);

	return (
		<Router>
			<Navbar user={user} />
			<Routes>
				<Route
					exact
					path="/"
					element={user ? <Navigate to="/profile" /> : <HomeScreen />}
				></Route>
				<Route
					path="/register"
					element={user ? <Navigate to="/profile" /> : <RegisterScreen />}
				></Route>
				<Route
					path="/login"
					element={user ? <Navigate to="/profile" /> : <LoginScreen />}
				></Route>
				<Route
					path="/profile"
					element={
						!user ? <Navigate to="/login" /> : <ProfileScreen user={user} />
					}
				></Route>
			</Routes>
		</Router>
	);
}

export default App;
