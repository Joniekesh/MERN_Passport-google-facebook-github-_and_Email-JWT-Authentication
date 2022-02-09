import React from "react";

const ProfileScreen = ({ user }) => {
	return (
		<div className="profile">
			<h1 className="profileText">Profile page</h1>
			<div className="profileInfo">
				Welcome <br />
				<h2>{user?.name}</h2>
				<p>
					You are accessing this <b>PRIVATE</b> route because you are logged in
				</p>
			</div>
		</div>
	);
};

export default ProfileScreen;
