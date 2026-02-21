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
        const response = await axios.post(DOMAIN + "/bidder/bidderSignin",
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

  // Get role badge color
  const getRoleColor = (roleName) => {
    const colors = {
      'User': 'from-blue-500 to-blue-600',
      'Admin': 'from-purple-500 to-purple-600',
      'Bidder': 'from-green-500 to-green-600'
    };
    return colors[roleName] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative">
      {showLoader && <Loader />}

      {/* Stadium Lights Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-1 bg-yellow-400/30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-64 h-1 bg-blue-400/30 blur-xl animate-pulse delay-300"></div>
      </div>

      {/* Moving Spotlight */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-full bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent -skew-x-12 animate-spotlight-move"></div>
      </div>

      {/* GLASS CARD */}
      <form
        className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-5 animate-fadeIn"
      >
        {/* Header with Stadium Style */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl animate-pulse">🏟️</span>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">
              AUCTION ARENA
            </h2>
          </div>
          <p className="text-white/50 text-xs tracking-wider">ENTER THE ARENA</p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-3"></div>
        </div>

        <h3 className="text-lg font-semibold text-white/80 text-center">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h3>

        {/* Role Toggle */}
        <div className="flex justify-center gap-3 mt-2">
          {Data.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.role)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all transform hover:scale-105 border ${
                role === item.role
                  ? `bg-gradient-to-r ${getRoleColor(item.role)} text-white border-transparent shadow-lg`
                  : "bg-white/5 border-white/10 text-black/60 hover:text-black hover:bg-white/10"
              }`}
            >
              {item.role}
            </button>
          ))}
        </div>

        {/* Fields */}
        {state === "register" && (role === "User" || role === "Admin" || role === "Bidder") && (
          <div className="space-y-1">
            <label className="text-xs text-white/60 flex items-center gap-1">
              <span className="text-yellow-400">👤</span>
              Name
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {(role === "User" || role === "Bidder" || role === "Admin") && (
          <>
            <div className="space-y-1">
              <label className="text-xs text-white/60 flex items-center gap-1">
                <span className="text-yellow-400">📧</span>
                Email
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition"
                placeholder="Enter your email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 flex items-center gap-1">
                <span className="text-yellow-400">🔒</span>
                Password
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition"
                placeholder="Enter your password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {role === "Admin" && state === "login" && (
          <div className="space-y-1">
            <label className="text-xs text-white/60 flex items-center gap-1">
              <span className="text-yellow-400">🔑</span>
              Admin Key
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition"
              placeholder="Enter admin key"
              value={adminKey}
              type="password"
              onChange={(e) => setAdminKey(e.target.value)}
            />
          </div>
        )}

        {/* Switch */}
        <p className="text-xs text-white/60 text-center">
          {state === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-yellow-400 font-medium cursor-pointer hover:text-yellow-300 transition"
            onClick={() => setState(state === "register" ? "login" : "register")}
          >
            {state === "register" ? "Login" : "Register"}
          </span>
        </p>

        {/* Button */}
        <button
          className="w-full py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-slate-400 to-slate-400 text-slate-900 hover:from-yellow-500 hover:to-orange-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-500/30"
          onClick={(e) => (state === "register" ? onCreateAccount(e) : onSubmit(e))}
        >
          {state === "register" ? "CREATE ACCOUNT" : "LOGIN TO ARENA"}
        </button>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full"></div>
      </form>

      <style jsx>{`
        @keyframes spotlight-move {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-spotlight-move {
          animation: spotlight-move 8s linear infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;