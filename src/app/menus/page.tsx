"use client";

import React, { useEffect, useState } from "react";
import { MdDelete, MdInfoOutline, MdEdit, MdMoreVert } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import CreateMenu from "@/components/menu/createMenu/page";
import { convertStatusMenu } from "@/lib/convertStatus";
import UpdateStatusMenu from "@/components/menu/updateStatusMenu/page";
import EditMenu from "@/components/menu/updateMenu/page";
import { truncate } from "@/lib/truncate";
import Link from "next/link";

export type MenuTypes = {
  id: number;
  name: string;
  status: string;
  description: string;
  price: string;
  categoryId: number;
};

export type CategoryTypes = {
  id: number;
  name: string;
};

type StatusTypes = string;

type MenusByCategoryTypes = {
  [categoryId: number]: {
    categoryName: string;
    menus: MenuTypes[];
  };
};

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<MenuTypes[]>([]);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [statuses, setStatuses] = useState<StatusTypes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState<MenuTypes | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuTypes | null>(null);
  const [detailsVisible, setDetailsVisible] = useState<Record<number, boolean>>(
    {}
  );
  const { showSuccess, showError } = useToast();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const [menusResponse, categoriesResponse, statusesResponse] =
        await Promise.all([
          fetch(generatePath(`/menus/all`)),
          fetch(generatePath("/categories/all")),
          fetch(generatePath("/menus/status")),
        ]);

      if (!menusResponse.ok || !categoriesResponse.ok || !statusesResponse.ok) {
        throw new Error(
          "Erreur lors de la récupération des menus, catégories ou statuts"
        );
      }

      const menusData: MenuTypes[] = await menusResponse.json();
      const categoriesData: CategoryTypes[] = await categoriesResponse.json();
      const statusesData: StatusTypes[] = await statusesResponse.json();

      setMenus(menusData);
      setCategories(categoriesData);
      setStatuses(statusesData);
    } catch (err: any) {
      setError(err.message);
      showError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMenus();
  }, []);

  const handleEditStatus = (menu: MenuTypes) => {
    setSelectedMenuId(menu.id);
    setStatus(menu.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const url = generatePath(
        `/menus/${selectedMenuId}/status?status=${encodeURIComponent(status)}`
      );
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setShowEditModal(false);
      setSelectedMenuId(null);
      void fetchMenus();
      showSuccess("Statut mis à jour avec succès.");
    } catch {
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleEditMenu = (menu: MenuTypes | null) => {
    setMenuToEdit(menu || null);
    setShowEditMenuModal(true);
  };

  const handleUpdateMenu = async () => {
    if (
      !menuToEdit ||
      !menuToEdit.name ||
      !menuToEdit.price ||
      !menuToEdit.categoryId
    ) {
      showError("Les informations du menu sont incomplètes.");
      return;
    }

    try {
      const url = generatePath("/menus");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du menu: ${response.statusText}`
        );
      }

      setShowEditMenuModal(false);
      showSuccess("Menu mis à jour avec succès.");
      void fetchMenus();
    } catch {
      showError("Erreur lors de la mise à jour du menu.");
    }
  };

  const handleDelete = async () => {
    if (!menuToDelete) return;
    try {
      await fetch(generatePath(`/menus/${menuToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchMenus();
      showSuccess("Menu supprimé avec succès.");
    } catch {
      showError("Erreur lors de la suppression du menu.");
    }
  };

  const confirmDelete = (menuId: number) => {
    const menu = menus.find((m) => m.id === menuId) || null;
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menusByCategory: MenusByCategoryTypes = categories.reduce(
    (acc, category) => {
      acc[category.id] = {
        categoryName: category.name,
        menus: filteredMenus
          .filter((menu) => menu.categoryId === category.id)
          .toSorted((a, b) => b.id - a.id),
      };
      return acc;
    },
    {} as MenusByCategoryTypes
  );

  const toggleDetails = (menuId: number) => {
    setDetailsVisible((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Liste des Menus</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2 cursor-pointer"
          onClick={toggleModal}
        >
          Créer un menu
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un menu"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: searchTerm && (
              <button
                type="button"
                className="flex items-center"
                onClick={() => setSearchTerm("")}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              ></button>
            ),
          }}
          sx={{
            width: "250px",
            height: "50px",
            position: "relative",
            marginLeft: "5px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#6a7282" },
              "&:hover fieldset": { borderColor: "blue" },
              "&.Mui-focused fieldset": { borderColor: "#155dfc" },
            },
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#ffffff",
            },
            "& .MuiInputLabel-root": {
              color: "#155dfc",
            },
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Créer une nouvelle menu
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                         relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateMenu
              onCreate={(menu) => {
                setMenus((prev) => [...prev, menu]);
                toggleModal();
              }}
              createMenuModal={toggleModal}
              categories={categories}
              statuses={statuses}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Nom</th>
            <th className="py-2 px-4 border border-gray-500">Prix</th>
            <th className="py-2 px-4 border border-gray-500">Description</th>
            <th className="py-2 px-4 border border-gray-500">Statut</th>
            <th className="py-2 px-4 border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="text-center py-2">
                Chargement...
              </td>
            </tr>
          ) : menus.length === 0 ? (
            <tr className="text-center">
              <td colSpan={6} className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucune menus disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            Object.entries(menusByCategory).map(
              ([, { categoryName, menus }]) =>
                menus.length > 0 && (
                  <React.Fragment key={categoryName}>
                    <tr className="text-center">
                      <td colSpan={9} className="font-bold text-lg pt-10">
                        {categoryName}
                      </td>
                    </tr>

                    {menus.map((menu) => (
                      <tr
                        key={menu.id}
                        className="hover:bg-gray-700 text-center"
                      >
                        <td className="py-3 px-4 border border-gray-500">
                          {menu.name}
                        </td>
                        <td className="py-3 px-4 border border-gray-500">
                          {menu.price}
                        </td>
                        <td className="py-3 px-4 border border-gray-500">
                          {truncate(menu.description, 20)}
                          {menu.description}
                        </td>
                        <td
                          className={`py-2 px-4 cursor-pointer border border-gray-500 ${
                            menu.status.toLowerCase() !== "active"
                              ? "text-red-500 font-bold"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => handleEditStatus(menu)}
                            className="w-full flex flex-row gap-1 items-center justify-center"
                          >
                            <span className="flex text-sm flex-row gap-1 items-center ">
                              <MdEdit />{" "}
                              {menu.status.toLowerCase() !== "active" && (
                                <span className="text-red-500 text-[10px]">
                                  ⚠️
                                </span>
                              )}
                              {convertStatusMenu(menu.status.toLowerCase())}
                            </span>
                          </button>
                        </td>
                        <td className="py-2 px-4 flex flex-row justify-center gap-2 border border-gray-500">
                          <button
                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 cursor-pointer"
                            onClick={() => handleEditMenu(menu)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2 cursor-pointer"
                            onClick={() => confirmDelete(menu.id)}
                          >
                            <MdDelete />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => toggleDetails(menu.id)}
                              className="detail focus:outline-none rounded p-2 bg-gray-900 z-40 cursor-pointer"
                            >
                              <MdMoreVert />
                            </button>
                            {detailsVisible[menu.id] && (
                              <div className="absolute text-start right-[1px] bottom-9 w-72 bg-gray-900 shadow-md rounded-md z-50">
                                <Link href={`/menus/${menu.id}`}>
                                  <button className="detail block text-start px-4 py-2 w-full cursor-pointer">
                                    Voir détail
                                  </button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
            )
          )}
        </tbody>
      </table>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <UpdateStatusMenu
              onSave={handleUpdateStatus}
              onCancel={() => setShowEditModal(false)}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}

      {showEditMenuModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <span
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer"
              onClick={() => setShowEditMenuModal(false)}
            >
              x
            </span>
            <EditMenu
              menuToEdit={menuToEdit}
              setMenuToEdit={setMenuToEdit}
              categories={categories}
              onSave={handleUpdateMenu}
              onCancel={() => setShowEditMenuModal(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <p>Voulez-vous vraiment supprimer le menu {menuToDelete?.name} ?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2 cursor-pointer"
                onClick={handleDelete}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
