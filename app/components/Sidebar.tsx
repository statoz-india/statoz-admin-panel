"use client";

import { SIDEBAR_MENU_ITEMS } from "@/app/utils/enums/section.enum";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  onLogout,
  isLoggingOut = false,
}: SidebarProps) {
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto p-4">
        <ul className="space-y-2">
          {SIDEBAR_MENU_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? " bg-white text-black"
                    : "text-gray-300  hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full text-center px-4 py-3 rounded-lg transition-colors  bg-black text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
