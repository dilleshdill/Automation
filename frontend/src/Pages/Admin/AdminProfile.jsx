import { React, useEffect, useState } from "react";
import AdminHomeNavBar from "../../Components/AdminComponent/AdminHomeNavBar";
import axios from "axios";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);

  const fetchedData = async () => {
    try {
      const adminId = localStorage.getItem("AdminId");
      const res = await axios.post(
        `${DOMAIN}/admin/get-admin`,
        { adminId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setAdminData(res?.data ?? {});
      }
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  return (
    <div className="min-w-screen min-h-screen flex flex-col !bg-slate-50">
      <AdminHomeNavBar />

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full px-4 md:px-10 lg:px-20 py-16">

        {/* LEFT SECTION */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          
          {/* cute supporter badge */}
          <div className="flex items-center gap-2 border border-slate-500 rounded-full px-3 py-1.5 text-xs text-slate-700">
            <div className="flex items-center">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                className="size-7 rounded-full border-[2px] border-white"
              />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                className="size-7 -translate-x-2 rounded-full border-[2px] border-white"
              />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50"
                className="size-7 -translate-x-4 rounded-full border-[2px] border-white"
              />
            </div>
            <span className="-translate-x-3 whitespace-nowrap">
              Support Our Franchise to Win!
            </span>
          </div>

          {/* Admin Info */}
          <h1 className="text-center md:text-left text-4xl md:text-6xl font-semibold tracking-tight text-slate-700">
            {adminData?.adminName ?? "Admin"}
          </h1>

          <p className="text-sm md:text-base text-slate-500">
            Email: {adminData?.email ?? "Not Available"}
          </p>

          {/* extra line for UI polish */}
          <p className="text-sm text-slate-400 max-w-md">
            Manage auctions, franchises, and players with ease.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png"
          alt="hero"
          className="max-w-sm md:max-w-md select-none pointer-events-none"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default AdminProfile;
