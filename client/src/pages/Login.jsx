 import React from "react";
import { Star, Globe, Users, Sparkles, Heart } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";
import { assets } from "../assets/assets";

const Login = () => {
  return (
    <div className="h-screen md:h-screen w-screen bg-gradient-to-br from-blue-950 via-slate-900 to-red-900 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      {/* Left side */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-20 xl:pl-32 relative">
        {/* Background Blurs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -right-20 w-60 h-60 bg-red-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Plixa Logo"
            className="h-12 w-12 rounded-xl shadow-lg border border-white/10"
          />
          <h1 className="text-3xl font-extrabold tracking-wide">
            <span className="text-blue-500">Pl</span>
            <span className="text-red-500">ixa</span>
          </h1>
        </div>

        {/* Hero */}
        <div className="relative z-10 w-full max-w-2xl mt-6 md:mt-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="size-4 text-amber-500 fill-amber-500" />
                  ))}
              </div>
              <span className="text-white/80 text-sm">Loved by 12k+ creators</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Chat. Create.
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
              Connect the World.
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            <span className="text-blue-400 font-semibold">Plixa</span> isn’t just another social
            app — it’s where creativity meets connection and real stories come alive.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Globe className="h-4 w-4 text-blue-400" />
              <span>Connect Worldwide</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users className="h-4 w-4 text-red-400" />
              <span>Real Vibes</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Creative Freedom</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Heart className="h-4 w-4 text-pink-400" />
              <span>Built with Passion</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm pt-6">
          © 2025 Plixa — Connect. Create. Inspire.
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-20">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-2">
                Welcome to Plixa
              </h2>
              <p className="text-white/70">
                Sign in and dive back into your creative space.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-1 shadow-lg">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent w-full",
                    header: "hidden",
                    socialButtons: "flex flex-col gap-3",
                    socialButtonsBlockButton:
                      "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500 text-sm",
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200",
                    formFieldInput:
                      "border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl py-3 px-4 transition-all duration-200",
                    footer: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
