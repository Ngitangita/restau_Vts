"use client"

import { useEffect, useState } from "react";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { generatePath } from "@/lib/config";
import useToast from "@/lib/useToast";
import CreateCategories from "@/components/createCategorie/page";
import EditModal from "@/components/updateCategorie/page";
import { CategoriesType } from "@/lib/types";
import dayjs from "dayjs";

const CategoriesList = () => {
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [error] = useState<null | string>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoriesType | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryToEdit, setCategoryToEdit] = useState<CategoriesType | null>(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState<boolean>(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    void fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(generatePath("/categories/all"));
      const data: CategoriesType[] = await res.json()
      setCategories(data);
    } catch (error: any) {
      showError(
        "Erreur lors de la récupération des categories: " + error.message
      );
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCategoryCreated = () => {
    void fetchCategories();
    setIsModalOpen(false);
    showSuccess("Catégorie créée avec succès");
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return
    try {
      await fetch(generatePath(`/categories/${categoryToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchCategories();
      showSuccess("Catégorie supprimée avec succès");
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  const confirmDelete = (categorieId: number) => {
    const category = categories.find((c) => c.id === categorieId) || null;
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category: CategoriesType) => {
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
      const url = generatePath(`/categories`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour de la catégorie: ${response.statusText}`
        );
      }

      setShowEditCategoryModal(false);
      void fetchCategories();
      showSuccess("Catégorie mise à jour avec succès");
    } catch (error) {
      showError("Erreur lors de la mise à jour de la catégorie");
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Liste des catégories</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Créer une catégorie
        </button>
        
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
            <CreateCategories
              onClose={toggleModal}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md " >
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Nom</th>
            <th className="py-2 px-4 border border-gray-500">Créé le</th>
            <th className="py-2 px-4 border border-gray-500">Modifié le</th>
            <th className="py-2 px-4 border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories
              .filter((category) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .toSorted((a, b) => b.id - a.id)
              .map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-700 text-center"
                >
                  <td className="py-2 px-4  border border-gray-500">{category.name}</td>
                  <td className="py-2 px-4  border border-gray-500">
                    {dayjs(category.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-2 px-4  border border-gray-500">
                    {dayjs(category.updatedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-2 px-4  border border-gray-500">
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
          <div className=" p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div>
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
          <div className=" p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
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
            <EditModal
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

export default CategoriesList;
