import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Axios from "../../Axios";
import { useNavigate } from "react-router-dom";

function Login({ showSignUp, showForgot }) {
	const [userData, setUserData] = useContext(UserContext);
	const axios = Axios();
	const navigate = useNavigate();
	const [form, setForm] = useState({});

	// const Login = (e)=> {
	//   e.preventDefault();
	//   if (userData.user) {
	//     navigate("/")
	//   }
	// // }
	// useEffect(() => {
	// 	if (userData.user) navigate("/");
	// }, [userData.user, navigate]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			//sending user data to database to be logged in
			const loginRes = await axios.post("/api/users/login", {
				email: form.email,
				password: form.password,
			});

			//update global state with response from backend(user-info)
			setUserData({
				token: loginRes.data.token,
				user: loginRes.data.user,
				config: {
					headers: { "x-auth-token": loginRes.data.token },
				},
			});

			//set localStorage with the token
			localStorage.setItem("auth-token", loginRes.data.token);

			//navigate user to homepage
			navigate("/");
		} catch (err) {
			console.log("Error :" + err.response.data.msg);
			alert("Error :" + err.response.data.msg);
		}
	};

	return (
		<div className="authfy-panel panel-login text-center active">
			<div className="authfy-heading">
				<h3 className="auth-title">Login to your account</h3>
				<p>
					{"Don’t have an account? "}
					<a
						className="lnk-toggler"
						data-panel=".panel-signup"
						href="#"
						onClick={showSignUp}
					>
						Create a new account
					</a>
				</p>
			</div>

			<div className="row">
				<div className="col-xs-12 col-sm-12">
					<div className="ajax-return-login"></div>
					<form
						name="loginForm"
						className="loginForm"
						href="/"
						method="POST"
						onSubmit={handleSubmit}
					>
						<div className="form-group wrap-input">
							<input
								type="email"
								className="form-control eva_email"
								name="email"
								placeholder="Email address"
								onChange={handleChange}
							/>
							<span className="focus-input"></span>
						</div>
                        <br>
						</br>

						<div className="form-group wrap-input">
							<div className="pwdMask">
								<input
									id="password"
									type="password"
									className="form-control eva_password"
									name="password"
									placeholder="Password"
									onChange={handleChange}
								/>
								<span className="focus-input"></span>
								<span
									id="togglePassword"
									className="fa fa-eye-slash pwd-toggle"
								></span>
								
							</div>
						</div>
						<div className="row remember-row">
							<div className="col-xs-6 col-sm-6"></div>
							<div className="col-xs-6 col-sm-6">
								<p className="forgotPwd">
									<a
										className="lnk-toggler"
										data-panel=".panel-forgot"
										href="#"
										onClick={showForgot}
									>
										Forgot password?
									</a>
								</p>
							</div>
						</div>

						<div className="form-group">
							<button
								className="btn btn-lg btn-primary btn-block"
								type="submit"
								// onClick={Login}
							>
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
