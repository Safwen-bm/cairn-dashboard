import React from "react";
import { FiChevronDown } from "react-icons/fi";

export const AccountToggle = () => {
  return (
    <div className="border-b border-stone-300 pb-4 mb-4">
      <button className="flex items-center gap-3 w-full p-2 rounded-lg transition hover:bg-stone-200">
        <img
          src="./profile.png"
          alt="Avatar"
          className="w-10 h-10 rounded-full bg-violet-500 shadow"
        />
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-stone-800">Safwen Is Loading</span>
          <span className="text-xs text-stone-500">safwen@hover.dev</span>
        </div>
        <FiChevronDown className="ml-auto text-stone-500" />
      </button>
    </div>
  );
};
