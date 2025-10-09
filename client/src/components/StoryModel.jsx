 import React, { useState } from 'react';
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const StoryModel = ({ setShowModel, fetchStories }) => {
  const bgColors = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#9D4EDD",
    "#FFB5E8",
    "#00B4D8"
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
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
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl text-white p-5">
        <button
          onClick={() => setShowModel(false)}
          className="absolute top-3 left-3 text-white/80 hover:text-white transition"
        >
          <ArrowLeft />
        </button>

        <h2 className="text-lg font-semibold text-center mb-4 mt-1 tracking-wide">
          Create a Story
        </h2>

        <div
          className="rounded-xl h-96 flex items-center justify-center relative overflow-hidden border border-white/10 shadow-inner"
          style={{
            backgroundColor: background,
            backdropFilter: "blur(6px)",
            backgroundBlendMode: "overlay"
          }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white/90 w-full h-full p-6 text-lg resize-none focus:outline-none text-center placeholder:text-white/60"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === "media" && previewUrl && (
            media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                className="object-contain max-h-full rounded-lg transition-all duration-300"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="object-contain max-h-full rounded-lg"
              />
            )
          )}
        </div>

        <div className="flex mt-4 gap-2 justify-center flex-wrap">
          {bgColors.map((color) => (
            <button
              key={color}
              className={`w-7 h-7 rounded-full ring-2 ring-white/30 hover:scale-110 transition`}
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 ${mode === "text"
              ? "bg-white/80 text-black shadow-md"
              : "bg-white/10 hover:bg-white/20"
              }`}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${mode === "media"
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
            <Upload size={18} /> Photo/Video
          </label>
        </div>

        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
              success: <p>Story Added</p>,
              error: (e) => <p>{e.message}</p>
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-5 w-full rounded-lg bg-gradient-to-r from-indigo-500/90 to-purple-600/90 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all shadow-md"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
