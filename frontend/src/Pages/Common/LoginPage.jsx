import { React, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const Data = [
  { id: "1", role: "User" },
  { id: "2", role: "Admin" },
  { id: "3", role: "Bidder" },
];

const LoginPage = () => {
  const [state, setState] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [role, setRole] = useState("User");
  const [showLoader, setLoader] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (role === "User") {
      try {
        const response = await axios.post(
          DOMAIN + "/auth/login",
          { role, email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          localStorage.setItem("userId", response.data.data);
          localStorage.setItem("role", "user");
          navigate("/user/auctions");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        toast.error("Invalid Email or Password");
      }
    }

    if (role === "Admin") {
      try {
        const response = await axios.post(
          DOMAIN + "/admin/login",
          { adminKey },
          { withCredentials: true },
        );
        if (response.status === 200) {
          localStorage.setItem("AdminId", response.data.data);
          localStorage.setItem("role", "admin");
          navigate("/admin");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        toast.error("Invalid Admin Key");
      }
    }

    if (role === "Bidder") {
      try {
        const response = await axios.post(
          DOMAIN + "/bidder/bidderSingin",
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          localStorage.setItem("BidderId", response.data.data);
          localStorage.setItem("role", "bidder");
          navigate("/bidder/auctions");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        toast.error("Invalid Email or Password");
      }
    }
  };

  const onCreateAccount = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (role === "User") {
      try {
        const response = await axios.post(
          DOMAIN + "/auth/register",
          { userName: name, email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setLoader(false);
          localStorage.setItem("userId", response.data.data);
          localStorage.setItem("role", "user");
          navigate("/user/auctions");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        setLoader(false);
        toast.error("Invalid Values");
      }
    }

    if (role === "Admin") {
      try {
        const response = await axios.post(
          DOMAIN + "/admin/register",
          { adminName: name, email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setLoader(false);
          localStorage.setItem("AdminId", response.data.data);
          localStorage.setItem("role", "admin");
          navigate("/admin");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        setLoader(false);
        toast.error("Invalid Values");
      }
    }

    if (role === "Bidder") {
      try {
        const response = await axios.post(
          DOMAIN + "/bidder/bidderSignup",
          { bidderName: name, email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setLoader(false);
          localStorage.setItem("BidderId", response.data.data);
          localStorage.setItem("role", "bidder");
          navigate("/bidder/auctions");
          toast.success("Welcome To The Auction");
        }
      } catch (err) {
        setLoader(false);
        toast.error("Invalid Values");
      }
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-[#dfe9f3] to-[#ffffff] relative">
      {showLoader && <Loader />}

      {/* GLASS CARD */}
      <form
        className="w-full max-w-sm bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-5 animate-fadeIn"
      >
        {/* Header */}
        <h2 className="text-xl font-semibold text-slate-700 text-center tracking-wide">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-3 mt-1">
          {Data.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.role)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border
                ${
                  role === item.role
                    ? "!bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white/40 border-white/50 text-slate-600 backdrop-blur-lg hover:bg-white/70"
                }
              `}
            >
              {item.role}
            </button>
          ))}
        </div>

        {/* Fields */}
        {state === "register" && (role === "User" || role === "Admin" || role === "Bidder") && (
          <div>
            <label className="text-xs text-slate-600">Name</label>
            <input
              className="w-full border border-white/40 bg-white/40 backdrop-blur-sm rounded-lg p-2 mt-1 text-sm outline-blue-500 shadow"
              placeholder="Type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {(role === "User" || role === "Bidder" || role === "Admin") && (
          <>
            <div>
              <label className="text-xs text-slate-600">Email</label>
              <input
                className="w-full border border-white/40 bg-white/40 backdrop-blur-sm rounded-lg p-2 mt-1 text-sm outline-blue-500 shadow"
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Password</label>
              <input
                className="w-full border border-white/40 bg-white/40 backdrop-blur-sm rounded-lg p-2 mt-1 text-sm outline-blue-500 shadow"
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {role === "Admin" && state === "login" && (
          <div>
            <label className="text-xs text-slate-600">Admin Key</label>
            <input
              className="w-full border border-white/40 bg-white/40 backdrop-blur-sm rounded-lg p-2 mt-1 text-sm outline-blue-500 shadow"
              placeholder="Secret key"
              value={adminKey}
              type="password"
              onChange={(e) => setAdminKey(e.target.value)}
            />
          </div>
        )}

        {/* Switch */}
        <p className="text-xs text-slate-600 text-center">
          {state === "register" ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setState(state === "register" ? "login" : "register")}
          >
            Click here
          </span>
        </p>

        {/* Button */}
        <button
          className="w-full py-2.5 text-sm font-medium rounded-lg !bg-blue-600 text-white hover:!bg-blue-700 transition shadow active:scale-[.97]"
          onClick={(e) => (state === "register" ? onCreateAccount(e) : onSubmit(e))}
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
