 import React, { useState } from 'react';
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const StoryModel = ({ setShowModel, fetchStories }) => {
  const bgColors = [
    "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
    "#9D4EDD", "#FFB5E8", "#00B4D8"
  ];

  const textColors = [
    "#FFFFFF", "#000000", "#FFD93D", "#FF6B6B",
    "#00B4D8", "#9D4EDD", "#6BCB77"
  ];

  const fontFamilies = [
    { name: "Sans", font: "Poppins, sans-serif" },
    { name: "Serif", font: "Georgia, serif" },
    { name: "Mono", font: "'JetBrains Mono', monospace" },
    { name: "Hand", font: "'Pacifico', cursive" },
    { name: "Playfair", font: "'Playfair Display', serif" }
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].font);
  const [fontSize, setFontSize] = useState(22);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async () => {};

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-[6px] bg-black/30">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl text-white p-4">
        {/* Back */}
        <button
          onClick={() => setShowModel(false)}
          className="absolute top-3 left-3 text-white/80 hover:text-white transition"
        >
          <ArrowLeft />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center mb-3 mt-1 tracking-wide">
          Create a Story
        </h2>

        {/* Story Preview */}
        <div
          className="rounded-xl h-80 flex items-center justify-center relative overflow-hidden border border-white/10 shadow-inner"
          style={{
            backgroundColor: background,
            backdropFilter: "blur(6px)",
            backgroundBlendMode: "overlay",
          }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent w-full h-full p-4 resize-none focus:outline-none text-center placeholder:text-white/60"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
              style={{
                color: textColor,
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                lineHeight: 1.4,
              }}
            />
          )}

          {mode === "media" && previewUrl && (
            media?.type.startsWith("image") ? (
              <img src={previewUrl} className="object-contain max-h-full rounded-lg" />
            ) : (
              <video src={previewUrl} controls className="object-contain max-h-full rounded-lg" />
            )
          )}
        </div>

        {/* Background Picker */}
        <div className="flex mt-3 gap-2 justify-center flex-wrap">
          {bgColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full ring-2 ring-white/30 hover:scale-110 transition"
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        {/* Compact Text Controls */}
        {mode === "text" && (
          <div className="mt-3 space-y-2">
            {/* Text + Font Row */}
            <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {/* Text Colors */}
              <div className="flex gap-2">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className={`w-5 h-5 rounded-full ring-2 ${textColor === color ? "ring-white" : "ring-white/30"} transition`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>

              {/* Font Styles */}
              <div className="flex gap-2 ml-2">
                {fontFamilies.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFontFamily(f.font)}
                    className={`px-2 py-1 text-xs rounded-md transition whitespace-nowrap ${
                      fontFamily === f.font
                        ? "bg-white/80 text-black font-semibold"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    style={{ fontFamily: f.font }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="flex items-center gap-2 justify-center mt-1">
              <span className="text-xs text-white/60">A</span>
              <input
                type="range"
                min="14"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-3/4 accent-purple-400 cursor-pointer"
              />
              <span className="text-lg text-white/80">A</span>
            </div>
          </div>
        )}

        {/* Mode Switch */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              mode === "text"
                ? "bg-white/80 text-black shadow-md"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <TextIcon size={16} /> Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              mode === "media"
                ? "bg-white/80 text-black shadow-md"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <input
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
            <Upload size={16} /> Media
          </label>
        </div>

        {/* Create Story */}
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
              success: <p>Story Added</p>,
              error: (e) => <p>{e.message}</p>,
            })
          }
          className="flex items-center justify-center gap-2 text-white py-2.5 mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-500/90 to-purple-600/90 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all shadow-md text-sm"
        >
          <Sparkle size={16} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
