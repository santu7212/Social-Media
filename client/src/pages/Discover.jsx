import React, { useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { MenuIcon, Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading"
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
    <div className="min-h-screen bg-gradfient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6 ">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Discover People
          </h1>
          <p className="text-slate-600 text-sm">
            connect with amazing people and grow you network{" "}
            <span className="text-blue-500 font-semibold">Pl</span>
            <span className="text-red-500 font-semibold">ixa</span> network
          </p>
        </div>

        {/* Search  */}
        <div
          className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white
        /80"
        >
          <div className="p-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2
              text-slate-600 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search people by name ,username,bio or location..."
                className="p1-10 sm:pl-12 py-2 w-full border border-grey-300 rounded-md max-sm:text-sm"
                onChange={(e) => setInput(e.target.value)} value={input} onKeyUp={handleSearch} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {users.map((user)=>(
            <UserCard user={user} key={user._id}/>
          ))}
        </div>

        {
          loading && (<Loading height="60vh"/>)
        }
      </div>
    </div>
  );
};

export default Discover;
