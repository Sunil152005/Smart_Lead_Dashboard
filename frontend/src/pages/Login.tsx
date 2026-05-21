import { useState } from "react";

import API from "../api";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const loginUser = async () => {
    try {
      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
    );

      alert("Login Successful");
      window.location.href ="/dashboard";

      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
  <div className="flex justify-center items-center h-screen bg-gray-100">

    <div className="bg-white p-8 rounded shadow-md w-80">

      <h1 className="text-3xl font-bold text-center mb-6">
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        className="bg-blue-500 text-white w-full p-2 rounded"
        onClick={loginUser}
      >
        Login
      </button>

    </div>

  </div>
);
}

export default Login;