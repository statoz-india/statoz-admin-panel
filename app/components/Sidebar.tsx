"use client";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const menuItems = [
    { id: "users", label: "Users" },
    { id: "quizzes", label: "Quizzes" },
    { id: "predictions", label: "Predictions" },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-black dark:text-white">
          Admin Panel
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
