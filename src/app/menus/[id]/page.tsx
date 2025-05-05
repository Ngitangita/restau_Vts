"use client"

import { useState, useEffect } from "react";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import dayjs from "dayjs";
import { generatePath } from "@/lib/config";
import ManageMenuIngredients from "@/components/menuIngredient/manageMenuIngredients/page";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Ingredient {
  id: number;
  ingredientName: string;
  quantity: number;
  unitName: string;
  createdAt: string;
  updatedAt: string;
}

interface Menu {
  menuName: string;
  menuPrice: number;
  status: string;
  menuDesc: string;
  ingredients: Ingredient[];
}

function MenuWithIngredients() {
  const { id: menuId } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  const fetchMenuWithIngredients = async () => {
    console.log(menuId);
    
    try {
      const parsedMenuId = parseInt(menuId ?? "", 10);
      if (isNaN(parsedMenuId)) {
        throw new Error("ID de menu invalide.");
      }

      const url = generatePath(`/menu-ingredients/menu/${parsedMenuId}`);
     
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Échec du chargement des données.");
      }

      const data: Menu = await response.json();
      console.log(data);
      
      setMenu(data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération du menu:", error.message);
      setError("Erreur lors de la récupération des données du menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuWithIngredients();
  }, [menuId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!menu) return <p>Aucun menu trouvé.</p>;

  const handleDelete = async () => {
    if (!ingredientToDelete) return;
    try {
      await fetch(
        generatePath(`/menu-ingredients/menu/${menuId}/ingredient/${ingredientToDelete.id}`),
        {
          method: "DELETE",
        }
      );
      setShowDeleteModal(false);
      fetchMenuWithIngredients();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ingrédient.", error);
    }
  };

  const confirmDelete = (ingredientId: number) => {
    const ingredient = menu.ingredients.find((m) => m.id === ingredientId);
    setIngredientToDelete(ingredient ?? null);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIngredientToDelete(null);
  };

  const nonEmptyIngredients = menu.ingredients.filter((obj) => Object.keys(obj).length > 0);

  return (
    <div>
      <div className="flex flex-row gap-5 items-center">
        <ManageMenuIngredients
          onAddIngredients={fetchMenuWithIngredients}
        />
        <Link href="/menuList" className="text-blue-500 hover:underline">
          Rétour au menu
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{menu.menuName}</h1>
      <p className="mb-4">Prix : {menu.menuPrice} Ar</p>
      <p className="mb-4">Statut : {menu.status}</p>
      <p className="mb-4">{menu.menuDesc}</p>

      <h2 className="text-xl font-bold mt-6">Ingrédients :</h2>
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Nom de l&apos;ingrédient</th>
            <th className="py-2 px-4 border border-gray-500">Quantité</th>
            <th className="py-2 px-4 border border-gray-500">Unité</th>
            <th className="py-2 px-4 border border-gray-500">Créé le</th>
            <th className="py-2 px-4 border border-gray-500">Mis à jour le</th>
            <th className="py-2 px-4 border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {nonEmptyIngredients.length === 0 ? (
            <tr >
              <td colSpan={6} className="py-4 text-gray-500">
                <span className="flex flex-col justify-center items-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <span>Aucun ingrédient disponible pour ce menu.</span>
                </span>
              </td>
            </tr>
          ) : (
            nonEmptyIngredients.map((ingredient, i) => (
              <tr key={i} >
                <td className="py-2 px-4 border border-gray-500">{ingredient.ingredientName}</td>
                <td className="py-2 px-4 border border-gray-500">{ingredient.quantity}</td>
                <td className="py-2 px-4 border border-gray-500">{ingredient.unitName}</td>
                <td className="py-2 px-4 border border-gray-500">
                  {dayjs(ingredient.createdAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="py-2 px-4 border border-gray-500">
                  {dayjs(ingredient.updatedAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="py-2 px-4 border border-gray-500">
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                    onClick={() => confirmDelete(ingredient.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 text-white">
            <p>
              Voulez-vous vraiment supprimer l&apos;ingrédient{" "}
              <strong>{ingredientToDelete?.ingredientName}</strong> ?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
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
}

export default MenuWithIngredients;
