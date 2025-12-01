"use client";

import React from "react";

// MAPPING: Define which base image to show based on Type + View
const TEMPLATES: any = {
  "T-Shirt": {
    front: "/templates/tshirt-front.png",
    back: "/templates/tshirt-back.png",
    left: "/templates/tshirt-left.png",
    right: "/templates/tshirt-right.png",
  },
  "Hoodie": {
    front: "/templates/hoodie-front.png",
    back: "/templates/hoodie-back.png",
    left: "/templates/hoodie-left.png",
    right: "/templates/hoodie-right.png",
  },
};

export default function TwoDShirt({
  design,
  view, // "front" | "back" | "left" | "right"
  setView,
}: any) {
  // 1. Get current IMAGE based on the view
  // Dynamic access: design.frontImage, design.leftImage, etc.
  const currentImage = (design as any)[`${view}Image`];

  // 2. Get current TEXT config based on the view
  // No strict check on view type allowing text on sleeves
  const currentText = (design.textConfig as any)?.[view] || null;

  // 3. Get Position/Scale Config
  const config =
    (design.designConfig as any)?.[view] || { scale: 1, x: 0, y: 0 };

  // 4. Resolve Base Image (Fallback to T-Shirt Front if missing)
  const baseImage =
    TEMPLATES[design.type]?.[view] || TEMPLATES["T-Shirt"].front;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative p-4">
      {/* --- CANVAS AREA --- */}
      <div className="relative w-full max-w-[400px] aspect-[3/4]">
        {/* BASE PRODUCT IMAGE */}
        <img
          src={baseImage}
          alt="Product Base"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
          style={{ filter: `drop-shadow(0 0 0 ${design.color})` }}
        />

        {/* Color overlay using mask */}
        <div
          className="absolute inset-0 w-full h-full mix-blend-multiply pointer-events-none z-1"
          style={{
            backgroundColor: design.color,
            maskImage: `url(${baseImage})`,
            WebkitMaskImage: `url(${baseImage})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />

        {/* PRINT AREA (z-index 10 ensures it's above the base image) */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          
          {/* USER IMAGE LAYER */}
          {currentImage && (
            <img
              src={currentImage}
              alt="Design"
              className="absolute"
              style={{
                top: `${50 + config.y * 50}%`, // map -1..1 to %
                left: `${50 + config.x * 50}%`,
                transform: `translate(-50%, -50%) scale(${config.scale})`,
                maxWidth: "60%",
                maxHeight: "60%",
                zIndex: 10
              }}
            />
          )}

          {/* USER TEXT LAYER */}
          {currentText?.content && (
            <div
              className="absolute whitespace-nowrap font-bold"
              style={{
                top: `${50 + (currentText.y || 0) * 50}%`,
                left: `${50 + (currentText.x || 0) * 50}%`,
                fontSize: `${(currentText.fontSize || 1) * 2}rem`, 
                transform: "translate(-50%, -50%)",
                color: currentText.color || "#000000",
                WebkitTextStroke: `${
                  currentText.thickness || 0
                }px ${currentText.color || "#000000"}`,
                fontFamily: "Arial, sans-serif",
                zIndex: 20 // Text stays on top of images
              }}
            >
              {currentText.content}
            </div>
          )}
        </div>
      </div>

      {/* --- VIEW SWITCHER --- */}
      <div className="absolute bottom-4 flex gap-2 bg-black/80 p-2 rounded-full backdrop-blur-md z-20">
        {["front", "back", "left", "right"].map((side) => (
          <button
            key={side}
            onClick={() => setView(side)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition ${
              view === side
                ? "bg-white text-black"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            {side}
          </button>
        ))}
      </div>
    </div>
  );
}