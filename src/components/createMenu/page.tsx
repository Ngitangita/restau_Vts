"use client";

import { generatePath } from "@/lib/config";
import { useEffect, useState } from "react";

type CategorieType = {
  id: string;
  name: string;
};
type StatusType = {
  id: string;
  status: string;
};

function CreateMenu() {
  const [menus, setMenus] = useState({
    id: 0,
    menuName: "",
    menuStatus: "",
    menuPrice: "",
    menuDescription: "",
    menuCategorie: "",
  });

  const [status, setStatus] = useState<string[]>([]);
  const [categorie, setCategorie] = useState<CategorieType[]>([]);

  const postMenus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !menus.menuName ||
      !menus.menuPrice ||
      !menus.menuDescription ||
      !menus.menuCategorie ||
      !menus.menuStatus
    ) {
      console.error("Tous les champs doivent être remplis");
      return;
    }

    const url = generatePath("/menus");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: menus.id,
        name: menus.menuName,
        status: parseInt(menus.menuStatus, 10),
        price: menus.menuPrice,
        description: menus.menuDescription,
        categoryId: parseInt(menus.menuCategorie, 10),
      }),
    });

    if (!res.ok) {
      console.error("Erreur lors de l'ajout du menu");
      return;
    }

    const data = await res.json();
  };

  useEffect(() => {
    void fetchStatus();
    void fetchCategorie();
  }, []);

  const fetchStatus = async () => {
    const url = generatePath("/menus/status");
    const res = await fetch(url);
    if (!res.ok) {
      console.error("fetch status failed");
      return;
    }
    const data: string[] = await res.json();
    setStatus(data);
  };

  const fetchCategorie = async () => {
    const url = generatePath("/categories/all");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("fetch categorie failed");
      }
      const data = await res.json();
      setCategorie(data);
      console.log("Categorie fetched:", data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenus((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMenus((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form className="p-6" onSubmit={postMenus}>
        <div className="mb-4">
          <label
            htmlFor="menuName"
            className="block text-sm font-medium text-start"
          >
            Nom du menu
          </label>
          <input
            type="text"
            id="menuName"
            name="menuName"
            value={menus.menuName}
            onChange={onChangeInput}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm outline-0 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du menu"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="menuStatus"
            className="block text-sm font-medium text-start"
          >
            Status
          </label>
          <select
            name="menuStatus"
            id="menuStatus"
            value={menus.menuStatus}
            onChange={onChangeSelect}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-gray-500">
              Sélectionnez le status
            </option>
            {status.length > 0 ? (
              status.map((statue, i) => (
                <option key={i} value={statue} className="bg-gray-500">
                  {statue}
                </option>
              ))
            ) : (
              <option>Aucun statut disponible</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="menuPrice"
            className="block text-sm font-medium text-start"
          >
            Prix
          </label>
          <input
            type="number"
            id="menuPrice"
            name="menuPrice"
            value={menus.menuPrice}
            onChange={onChangeInput}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm outline-0 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Prix"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="menuDescription"
            className="block text-sm font-medium text-start"
          >
            Description
          </label>
          <input
            type="text"
            id="menuDescription"
            name="menuDescription"
            value={menus.menuDescription}
            onChange={onChangeInput}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm outline-0 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="menuCategorie"
            className="block text-sm font-medium text-start"
          >
            Catégorie
          </label>
          <select
            name="menuCategorie"
            id="menuCategorie"
            value={menus.menuCategorie}
            onChange={onChangeSelect}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-gray-500">
              Sélectionnez la catégorie
            </option>
            {categorie.length > 0 ? (
              categorie.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-500">
                  {cat.name}
                </option>
              ))
            ) : (
              <option>Aucune catégorie disponible</option>
            )}
          </select>
        </div>

        <div className="flex flex-row gap-10 w-full justify-between">
          <button
            type="button"
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            onClick={() => {
              setMenus({
                id: 0,
                menuName: "",
                menuStatus: "",
                menuPrice: "",
                menuDescription: "",
                menuCategorie: "",
              });
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMenu;
