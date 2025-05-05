"use client";

import { generatePath } from "@/lib/config";
import { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import AddIngredientsToMenu from "../addIngredientsToMenu/page";

const ManageMenuIngredients = ({
  onAddIngredients,
}: {
  onAddIngredients: () => void;
}) => {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(generatePath("/ingredients/all"));
        const data = await response.json();
        setIngredientsList(data);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredients = () => {
    onAddIngredients();
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className=" MenuList">
      <button
        onClick={openModal}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 flex 
                flex-row items-center gap-2 cursor-pointer"
      >
        <MdAddBox /> Ajouter des ingrédients au menu
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Gestion des ingrédients de menus
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={handleCloseModal}
              >
                x
              </span>
            </div>
            <AddIngredientsToMenu
              onAddIngredients={handleAddIngredients}
              ingredients={ingredientsList}
              closeModal={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenuIngredients;
