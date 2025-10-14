 import React, { useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">People</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Connect with amazing people and grow your network on{" "}
            <span className="text-blue-600 font-semibold">Pl</span>
            <span className="text-red-500 font-semibold">ixa</span>
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 backdrop-blur-lg bg-white/70 border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name, username, bio, or location..."
                className="pl-12 pr-4 py-3 w-full text-sm sm:text-base text-slate-800 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* User Cards */}
        {loading ? (
          <Loading height="60vh" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard user={user} key={user._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
