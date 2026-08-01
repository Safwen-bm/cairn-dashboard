import React from "react";
import { StartCards } from "./StartCards";
import { ActivityGraph } from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";

export const Grid = () => {
  return (
    <div className="px-4 grid gap-3 
    grid-cols-12">
        <StartCards />
        <ActivityGraph />
        <UsageRadar />
        <RecentTransactions />
    </div>
  );
};