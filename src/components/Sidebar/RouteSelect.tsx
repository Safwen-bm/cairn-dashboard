import React from "react";
import { IconType } from "react-icons";
import { FiDollarSign, FiHome, FiLink, FiPaperclip, FiUsers } from "react-icons/fi";

export const RouteSelect = () => {
  return (
    <nav className="space-y-2">
      <Route Icon={FiHome} selected={true} title="Dashboard" />
      <Route Icon={FiUsers} selected={false} title="Team" />
      <Route Icon={FiPaperclip} selected={false} title="Invoices" />
      <Route Icon={FiLink} selected={false} title="Integrations" />
      <Route Icon={FiDollarSign} selected={false} title="Finance" />
    </nav>
  );
};

const Route = ({
  selected,
  Icon,
  title,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
}) => {
  return (
    <button
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
        selected
          ? "bg-violet-500 text-white shadow-lg"
          : "bg-transparent text-stone-600 hover:bg-stone-200"
      }`}
    >
      <Icon className={`text-lg ${selected ? "text-white" : "text-violet-500"}`} />
      <span>{title}</span>
    </button>
  );
};
