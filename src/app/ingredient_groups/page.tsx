"use client";

import { useEffect, useState } from "react";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import { Types } from "@/lib/types";
import UpdateCategorieIngredient from "@/components/ingredients/updateCategorieIngredient/page";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import CreateCategorieIngredient from "@/components/ingredients/create_ingredient_groups/page";

const CategoriesIngredientList = () => {
  const [ingredientGroups, setIngredientGroups] = useState<Types[]>(
    []
  );
  const [error] = useState<null | string>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Types | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Types | null>(
    null
  );
  const [showEditCategoryModal, setShowEditCategoryModal] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    void fetchIngredientGroup();
  }, []);

  const fetchIngredientGroup = async () => {
    try {
      const res = await fetch(generatePath("/ingredients/groups"));
      if (!res.ok) {
        throw "Récupération des ingredients failed";
      }
      const data = await res.json();
      setIngredientGroups(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ingredients groups:",
        error
      );
      showError("Impossible de charger les ingredients groups");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCategoryCreated = () => {
    void fetchIngredientGroup();
    setIsModalOpen(false);
    showSuccess("Catégorie créée avec succès");
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await fetch(generatePath(`/ingredients/groups/${categoryToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchIngredientGroup();
      showSuccess("Catégorie supprimée avec succès");
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  const confirmDelete = (categorieId: number) => {
    const category = ingredientGroups.find((c) => c.id === categorieId) || null;
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category: Types) => {
    setCategoryToEdit(category || {});
    setShowEditCategoryModal(true);
  };

  const handleSaveEdit = async () => {
    if (!categoryToEdit || !categoryToEdit.id || !categoryToEdit.name) {
      console.error("Les informations de la catégorie sont incomplètes.");
      showError("Les informations de la catégorie sont incomplètes.");
      return;
    }

    try {
      await fetch(generatePath(`/ingredients/groups/${categoryToEdit.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryToEdit.name }),
      });
      setShowEditCategoryModal(false);
      void fetchIngredientGroup();
      showSuccess("Catégorie mise à jour avec succès");
    } catch (error) {
      showError("Erreur lors de la mise à jour de la catégorie");
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Liste des catégories ingredient
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Créer une catégorie ingredient
        </button>
        <TextField
          label="Rechercher une catégorie"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleChange}
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
                Créer une nouvelle catégorie
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateCategorieIngredient
              onClose={toggleModal}
              onCategoryCreated={handleCategoryCreated}
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
          {ingredientGroups.length > 0 ? (
            ingredientGroups
              .filter((category) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => b.id - a.id)
              .map((category) => (
                <tr key={category.id} className="hover:bg-gray-700 text-center">
                  <td className="py-3 px-4  border border-gray-500">
                    {category.name}
                  </td>
                  <td className="py-3 px-4  border border-gray-500">
                    {dayjs(category.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4  border border-gray-500">
                    {dayjs(category.updatedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4  border border-gray-500">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2 cursor-pointer"
                      onClick={() => handleEditCategory(category)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600 cursor-pointer"
                      onClick={() => confirmDelete(category.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center  w-full ">
                <div className="flex w-full justify-center items-center flex-col">
                  <MdInfoOutline className="text-4xl inline-block mb-2 text-gray-400" />
                  <span>Aucune catégorie trouvée</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="p-6">
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer le catégorie{" "}
                {categoryToDelete?.name} ?
              </p>
              <div className="flex justify-between">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                  onClick={cancelDelete}
                >
                  Non
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  onClick={handleDelete}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier la catégorie</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditCategoryModal(false)}
              >
                x
              </span>
            </div>
            <UpdateCategorieIngredient
              setCategoryToEdit={setCategoryToEdit}
              categoryToEdit={categoryToEdit}
              onSave={handleSaveEdit}
              onCancel={() => setShowEditCategoryModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesIngredientList;
