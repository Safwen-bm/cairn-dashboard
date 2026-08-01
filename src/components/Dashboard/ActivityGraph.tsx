"use client";

import React from "react";
import { FiUser } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", desktop: 4000, mobile: 2400 },
  { name: "Feb", desktop: 3000, mobile: 1398 },
  { name: "Mar", desktop: 2000, mobile: 9800 },
  { name: "Apr", desktop: 2780, mobile: 3908 },
  { name: "May", desktop: 1890, mobile: 4800 },
  { name: "Jun", desktop: 2390, mobile: 3800 },
  { name: "Jul", desktop: 3490, mobile: 4300 },
];

export const ActivityGraph = () => {
  return (
    <div className="col-span-8 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
      <div className="p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <FiUser className="text-blue-500" /> Activity Overview
        </h3>
        <p className="text-sm text-gray-500">
          Monthly desktop and mobile activity trends
        </p>
      </div>

      {/* Graph */}
      <div className="h-72 px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#9e9e9e" }}
              tickLine={false}
              axisLine={{ stroke: "#d0d0d0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9e9e9e" }}
              tickLine={false}
              axisLine={{ stroke: "#d0d0d0" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #d0d0d0",
              }}
              labelStyle={{ color: "#555" }}
              itemStyle={{ color: "#555" }}
            />
            <Legend
              wrapperStyle={{ top: -10 }}
              iconType="circle"
              align="right"
              verticalAlign="top"
            />
            <Line
              type="monotone"
              dataKey="mobile"
              stroke="#4f46e5"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="desktop"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};