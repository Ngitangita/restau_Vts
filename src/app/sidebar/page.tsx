"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdMenu } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { RiMenuUnfold4Line } from "react-icons/ri";
import { useTitleStore } from "@/lib/useTitleStore";

type MenuItem = {
  title: string;
  path?: string;
  subItems?: { title: string; path: string }[];
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
  { title: "N° de l'étage", path: "/floors", subItems: [] },
  { title: "Customers", path: "/customers", subItems: [] },
];

export const SidebarToggleButton: React.FC<{
  handleSidebarToggle: () => void;
  openSidebar: boolean;
}> = ({ handleSidebarToggle, openSidebar }) => (
  <button
    className="fixed top-4 left-20 z-50 rounded-full p-3 bg-slate-100 text-2xl flex 
      items-center justify-center hover:bg-slate-200 lg:hidden"
    onClick={handleSidebarToggle}
  >
    {openSidebar ? (
      <MdMenu className="text-gray-500 text-xl" />
    ) : (
      <RiMenuUnfold4Line className="text-gray-500 text-xl" />
    )}
  </button>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const setTitle = useTitleStore((state) => state.setTitle);

  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [submenuState, setSubmenuState] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleSubmenuToggle = (index: number) => {
    setActiveTab(index);
    setSubmenuState((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSidebarToggle = () => setOpenSidebar(!openSidebar);
  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) setOpenSidebar(false);
  };

  const handleTitleChange = (title: string) => {
    setTitle(title);
    handleCloseSidebar();
  };

  return (
    <>
      <SidebarToggleButton
        openSidebar={openSidebar}
        handleSidebarToggle={handleSidebarToggle}
      />

      <div
        className={`bg-gray-900 shadow-md w-60 h-screen fixed z-50 p-2 left-0 flex flex-col
          overflow-y-scroll overflow-x-hidden transition-transform duration-300 
          ease-in-out ${
            openSidebar ? "translate-x-0 z-10" : "-translate-x-full"
          } lg:translate-x-0 lg:block`}
        onMouseEnter={() => setShowScrollbar(true)}
        onMouseLeave={() => setShowScrollbar(false)}
        style={{
          scrollbarWidth: showScrollbar ? "thin" : "none",
          overflowY: showScrollbar ? "scroll" : "hidden",
        }}
      >
        <div className="flex items-center justify-between p-2 text-2xl font-bold text-gray-100 border-b border-gray-700">
          <h1>Tableau de bord</h1>
        </div>

        <ul className="mt-4">
          {menuItems.map((item, index) => (
            <li key={index} className="space-y-2">
              {item.subItems?.length ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(index)}
                    className="hover:bg-gray-800 rounded-lg w-full  text-white flex items-center p-2">
                    <div className="flex items-center gap-3">
                      {item.title}
                    </div>
                    <FaAngleRight
                      className={`ml-auto text-gray-500 transition-transform duration-300 ${
                        submenuState[index] ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`pl-4 transition-all duration-300 ${
                      submenuState[index] ? "h-auto" : "h-0 overflow-hidden"
                    }`}
                  >
                    <ul
                      className={`transition-opacity duration-300 ${
                        submenuState[index] ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.subItems.map((subItem, subIdx) => (
                        <li
                          key={subIdx}
                          onClick={() => handleTitleChange(subItem.title)}
                        >
                          <Link
                            href={subItem.path}
                            className={`flex items-center text-[#fff!important] p-2 rounded-lg hover:bg-gray-800 ${
                              pathname === subItem.path ? "bg-gray-700" : ""
                            }`}
                          >
                              {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={item.path ?? "#"}
                  onClick={() => handleTitleChange(item.title)}
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${
                    pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <style jsx global>{`
        .Sidebar::-webkit-scrollbar {
          width: ${showScrollbar ? "8px" : "0px"};
        }
        .Sidebar::-webkit-scrollbar-thumb {
          background-color: gray;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
