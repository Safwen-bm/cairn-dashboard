import React from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

export const StartCards = () => {
  return (
    <>
      <Card
        title="Gross Revenue"
        value="$120,054.24"
        pillText="2.75%"
        trend="up"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Avg Order"
        value="$27.97"
        pillText="1.01%"
        trend="down"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Trailing Year"
        value="$278,054.24"
        pillText="60.75%"
        trend="up"
        period="Previous 365 days"
      />
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-[70%]">
          <h3 className="text-sm font-medium text-stone-500">{title}</h3>
          <p
            className="text-3xl font-semibold truncate mt-1"
            title={value} 
          >
            {value}
          </p>
        </div>
        {/* Pill */}
        <span
          className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
          {pillText}
        </span>
      </div>
      {/* Period */}
      <p className="text-sm text-stone-500">{period}</p>
    </div>
  );
};