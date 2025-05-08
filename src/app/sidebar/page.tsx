"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "@deemlol/next-icons";
import { useTitleStore } from "@/lib/useTitleStore";

type MenuItem = {
  title: string;
  path: string;
  subItems: { title: string; path: string }[];
};

function Sidebar() {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState<
    Record<number, boolean>
  >({});
  const setTitle = useTitleStore(state => state.setTitle);

  const pathname = usePathname();

  const handleSubmenuToggle = (index: number) => {
    setActiveTab(index);
    setIsToggleSubmenu((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const menuItems: MenuItem[] = [
    { title: "Accueil", path: "/", subItems: [] },
    { title: "Menus", path: "/menus", subItems: [] },
    { title: "Stocks", path: "/stocks", subItems: [] },
    { title: "Achat stocks", path: "/purchases", subItems: [] },
    { title: "Catégorie", path: "/categorie", subItems: [] },
    { title: "Ingredient", path: "/ingredients", subItems: [] },
    { title: "Ingredient groups", path: "/ingredient_groups", subItems: [] },
    { title: "Unité", path: "/unites", subItems: [] },
    { title: "Tables", path: "/tables", subItems: [] },
    { title: "Customers", path: "/customers", subItems: [] },
  ];

  const handleChangeTitle = (title: string) => {
    setTitle(title);
  };

  return (
    <div className="bg-gray-900 text-white shadow-md w-60 h-screen fixed z-50 p-2">
      <div className="flex items-center justify-between p-4 text-2xl font-bold text-gray-100 border-b border-gray-700">
        <h1>Tableau de bord</h1>
      </div>
      <ul className="mt-4">
        {menuItems.map((items, i) => (
          <li key={i} className="text-gray-300 hover:bg-gray-800 rounded-lg">
            {items.subItems.length > 0 ? (
              <div className="mb-2">
                <button
                  onClick={() => handleSubmenuToggle(i)}
                  className="w-full text-left p-3 font-medium focus:outline-none flex justify-between items-center"
                >
                  {items.title}
                  <span
                    className={`transform ${
                      isToggleSubmenu[i] ? "rotate-90" : "rotate-0"
                    }`}
                  >
                  <ChevronRight size={24} color="#FFFFFF" />
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ${
                    isToggleSubmenu[i] ? "h-auto" : "h-0 overflow-hidden"
                  }`}
                >
                  <ul className="ml-4 mt-2 space-y-1">
                    {items.subItems.map((subItem, subI) => (
                      <li
                        key={subI}
                        onClick={() => handleChangeTitle(subItem.title)}
                      >
                        <Link
                          href={subItem.path}
                          className={`block p-2 rounded-lg ${
                            pathname === subItem.path
                              ? "bg-gray-700 text-white"
                              : ""
                          } hover:bg-gray-700`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                href={items.path}
                className={`block p-3 rounded-lg ${
                  pathname === items.path ? "bg-gray-700 text-white" : ""
                } hover:bg-gray-800`}
                onClick={() => handleChangeTitle(items.title)}
              >
                {items.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
