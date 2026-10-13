"use client";

import { createContext, useContext } from "react";
import type { Label } from "@/lib/types";

const LabelsContext = createContext<Record<string, Label>>({});

export const LabelsProvider = LabelsContext.Provider;

/** Label id to label lookup, so cards and dialogs do not need it passed down. */
export function useLabelMap(): Record<string, Label> {
  return useContext(LabelsContext);
}