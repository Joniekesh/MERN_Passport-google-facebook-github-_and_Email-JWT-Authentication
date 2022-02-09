import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
	const logout = () => {
		window.open("http://localhost:5000/auth/logout", "_self");
		localStorage.removeItem("token");
	};

	return (
		<>
			<div className="navbar">
				<div className="navbar-title">
					<h2>MERN Authentication</h2>
				</div>
				<ul className="navbarList">
					{user ? (
						<>
							<Link to="/profile">
								<li className="navbarListItem">
									<img
										className="navbarImg"
										src={user.avatar || "/assets/avatar.jpeg"}
										alt=""
									/>
								</li>
							</Link>
							<li>
								<span>{user.name}</span>
							</li>
							<li onClick={logout} className="logout">
								Logout
							</li>
						</>
					) : (
						<>
							<Link to="/register">
								<li className="navbarListItem">Register</li>
							</Link>
							<Link to="/login">
								<li className="navbarListItem">Login</li>
							</Link>
						</>
					)}
				</ul>
			</div>
		</>
	);
};

export default Navbar;
