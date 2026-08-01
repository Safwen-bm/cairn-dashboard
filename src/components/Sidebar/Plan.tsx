import React from "react";

export const Plan = () => {
  return (
    <div className="p-4 border-t border-stone-300 flex flex-col items-center">
      <img
        src="/logo.png"
        alt="SafOne Logo"
        className="max-w-[120px] mb-2 rounded-lg shadow-lg transition-transform hover:scale-105"
      />
      <span className="text-xs text-stone-500">Powered by SafOne</span>
    </div>
  );
};
