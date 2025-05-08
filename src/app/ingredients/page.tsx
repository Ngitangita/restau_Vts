"use client";

import { useCallback, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import EditIngredients from "@/components/ingredients/updateIngredient/page";
import CreateIngredient from "@/components/ingredients/createIngredients/page";
import useFetch from "@/lib/useFetch";

type Types = {
  id: number;
  name: string;
  updatedAt: string;
  createdAt: string;
  unitId: number;
};

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Types[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Types | null>(
    null
  );
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
    null
  );
  const [ingredientName, setIngredientName] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const { showSuccess, showError } = useToast();

  const { data: units } = useFetch(() => generatePath("/units/all"));
  const [searchTerm, setSearchTerm] = useState("");

  const fetchIngredients = async () => {
    try {
      const res = await fetch(generatePath("/ingredients/all"));
      if (!res.ok) {
        showSuccess("Les ingrédients a été récupérés avec succès");
      }
      const data: Types[] = await res.json();
      setIngredients(data);
    } catch {
      showError("Erreur lors de la récupération des ingrédients");
    }
  };

  useEffect(() => {
    void fetchIngredients();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
    void fetchIngredients();
  }, []);

  const handleDelete = async () => {
    if (!ingredientToDelete) return;
    try {
      await fetch(generatePath(`/ingredients/${ingredientToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      showSuccess("Ingrédient supprimé avec succès");
      void fetchIngredients();
    } catch (error) {
      showError("Erreur lors de la suppression de l'ingrédient");
      console.error("Erreur lors de la suppression de l'ingredients:", error);
    }
  };

  const confirmDelete = (ingredientId: number) => {
    const ingredient = ingredients.find((i) => i.id === ingredientId) || null;
    setIngredientToDelete(ingredient);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIngredientToDelete(null);
  };

  const handleEdit = (ingredient: Types) => {
    setSelectedIngredient(ingredient.id);
    setIngredientName(ingredient.name);
    setUnitId(ingredient.unitId);
    setShowEditModal(true);
  };

  const handleUpdateIngredient = async () => {
    if (!ingredientName || !unitId) {
      const errorMessage = "Veuillez fournir un nom et sélectionner une unité";
      showError(errorMessage);
      setError(errorMessage);
      return;
    }

    try {
      await fetch(generatePath(`/ingredients`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedIngredient,
          name: ingredientName,
          unitId: unitId,
        }),
      });
      setShowEditModal(false);
      setSelectedIngredient(null);
      void fetchIngredients();
      showSuccess("Ingrédient mis à jour avec succès");
    } catch {
      const errorMessage = "Erreur lors de la mise à jour de l'ingrédient";
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Liste des Ingrédients</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2 cursor-pointer"
          onClick={toggleModal}
        >
          Créer un ingrédient
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un ingrédient"
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
                Ajouter un nouvel ingrédient
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateIngredient
              onModalOpen={handleModalOpen}
              onToggle={toggleModal}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Nom</th>
            <th className="py-2 px-4 border border-gray-500">Créé le</th>
            <th className="py-2 px-4 border border-gray-500">Modifié le</th>
            <th className="py-2 px-4 border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.length === 0 ? (
            <tr className="hover:bg-gray-700 text-center">
              <td colSpan={5} className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucun ingrédient disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredIngredients
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className="hover:bg-gray-700 text-center"
                >
                  <td className="py-3 px-4 border border-gray-500">
                    {ingredient.name}
                  </td>
                  <td className="py-3 px-4 border border-gray-500">
                    {dayjs(ingredient.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4 border border-gray-500">
                    {dayjs(ingredient.updatedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-2 px-4 flex flex-row gap-2 justify-center border border-gray-500">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600 cursor-pointer"
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
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg DeleteModal sm:p-6 md:p-8 lg:p-10">
            <p>
              Êtes-vous sûr de vouloir supprimer l&apos;ingrédient{" "}
              {ingredientToDelete?.name} ?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 cursor-pointer"
                onClick={handleDelete}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="bg-white rounded-lg shadow-lg EditModal sm:w-full 
          md:w-[400px] lg:w-[500px] xl:w-[600px] sm:p-4 md:p-6 lg:p-8"
          >
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Modifier l&apos;ingrédient
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <EditIngredients
              ingredientName={ingredientName}
              setIngredientName={setIngredientName}
              unitId={unitId}
              setUnitId={setUnitId}
              // units={units}
              onSave={handleUpdateIngredient}
              onCancel={() => setShowEditModal(false)}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientList;
