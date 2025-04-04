"use client";

import CreateMenu from "@/components/createMenu/page";
import { generatePath } from "@/lib/config";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type MenuType = {
  id: number;
  name: string;
  status: string;
  description: string;
  price: number;
};

function MenuPage() {
  const [menus, setMenus] = useState<MenuType[]>([]);

  useEffect(() => {
    void fetchMenu();
    void fetchMenuStatus();
  }, []);

  const fetchMenu = async () => {
    const url = generatePath("/menus/all");
    const res = await fetch(url);
    if (!res.ok) {
      throw "fetch menu failed";
    }
    const data = await res.json();
    setMenus(data);
  };

  const fetchMenuStatus = async () => {
    const url = generatePath("/menus/status");
    const res = await fetch(url);
    if (!res.ok) {
      throw "fetch status failed";
    }
    const data = await res.json();
    setMenus(data);
  };

  const deleteMenu = async (id: number) => {
    const url = generatePath(`/menus/${id}`);
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw "can't delete";
    }
    void fetchMenu();
  };

  return (
    <div>
      <h1>Lists des menus</h1>
      <table>
        <thead>
          <tr>
            <th>Nom de menu</th>
            <th>Status</th>
            <th>La déscription</th>
            <th>Prix</th>
            <th>Categorie</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, i) => (
            <tr key={i}>
              <td>{menu.name}</td>
              <td>{menu.status}</td>
              <td>{menu.description}</td>
              <td>{menu.price}</td>
              <td>
                <Link href={`/menus/${menu.id}`}>
                  <button className="bg-blue-500 p-2 rounded text-white cursor-pointer">
                    Details
                  </button>
                </Link>
              </td>
              <td>
                <button
                  className="bg-red-500 p-2 rounded text-white cursor-pointer"
                  onClick={() => deleteMenu(menu.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateMenu />
    </div>
  );
}

export default MenuPage;
