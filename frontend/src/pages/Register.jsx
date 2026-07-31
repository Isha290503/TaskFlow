// Import hooks
import { useState } from "react";

// Import router
import { Link, useNavigate } from "react-router-dom";

// Import API
import API from "../services/api";

function Register() {

    // Navigation
    const navigate = useNavigate();

    // Form state
    const [form, setForm] = useState({

        name: "",
        email: "",
        password: ""

    });

    // Handle input
    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    // Register
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/register", form);

            alert(res.data.message);

            navigate("/");

        } catch (error) {

            alert(error.response?.data?.message || "Registration Failed");

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-blue-600">

                    TaskFlow

                </h1>

                <p className="text-center text-gray-500 mt-2 mb-6">

                    Create your account

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 text-gray-700">

                            Name

                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 text-gray-700">

                            Email

                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 text-gray-700">

                            Password

                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >

                        Register

                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="text-blue-600 font-semibold hover:underline"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;