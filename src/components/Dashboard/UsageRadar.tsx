"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Tracking", A: 120, B: 110, fullMark: 150 },
  { subject: "Val", A: 98, B: 130, fullMark: 150 },
  { subject: "Bul", A: 86, B: 130, fullMark: 150 },
  { subject: "Schedul", A: 99, B: 100, fullMark: 150 },
  { subject: "AI Train", A: 85, B: 90, fullMark: 150 },
];

export const UsageRadar = () => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300 bg-white shadow">
      <h3 className="mb-4 text-lg font-medium text-stone-600">
        Usage Radar Overview
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" stroke="#374151" fontSize={12} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#9ca3af" />
            <Radar
              name="Mobile"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="Desktop"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Legend wrapperStyle={{ bottom: -10 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};