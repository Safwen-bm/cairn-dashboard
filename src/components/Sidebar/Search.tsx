"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { CommandMenu } from "./CommandMenu";

export const Search = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative mb-4">
        <div className="flex items-center px-3 py-2 bg-stone-200 rounded-lg shadow-sm">
          <FiSearch className="mr-2 text-stone-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            onFocus={(e) => {
              e.target.blur();
              setOpen(true);
            }}
          />
          <span className="absolute right-2 flex items-center gap-1 text-xs bg-stone-50 px-2 py-0.5 rounded-lg shadow-sm text-stone-600">
            ⌘ K
          </span>
        </div>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};
