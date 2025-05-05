"use client";

import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import CreateUnit from "@/components/createUnite/page";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";

type UnitType = {
  id: number;
  name: string;
  abbreviation: string;
};

function UnitsList() {
  const [units, setUnits] = useState<UnitType[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [unitsList, setUnitsList] = useState<UnitType>({
    id: 0,
    name: "",
    abbreviation: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showSuccess, showError } = useToast();
  const [unitToDelete, setUnitToDelete] = useState<UnitType | null>(null);

  const fetchUnits = async () => {
    try {
      const res = await fetch(generatePath("/units/all"));
      if (!res.ok) throw new Error("Erreur lors de la récupération des unités");
      const data: UnitType[] | null = await res.json();
      setUnits(data ?? []);
    } catch (error: any) {
      showError("Erreur lors de la récupération des unités: " + error.message);
    }
  };

  useEffect(() => {
    void fetchUnits();
  }, []);

  const confirmDelete = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId) || null;
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    try {
      await fetch(generatePath(`/units/${unitToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchUnits();
      showSuccess("Unit supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la unit:", error);
      showError("Erreur lors de la suppression de la unit.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUnitToDelete(null);
  };

  const handleEdit = (unit: UnitType) => {
    setUnitsList({
      id: unit.id,
      name: unit.name,
      abbreviation: unit.abbreviation,
    });
    setShowEditModal(true);
  };

  const handleUpdateUnit = async () => {
    try {
      await fetch(generatePath(`/units`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: unitsList.id,
          name: unitsList.name,
          abbreviation: unitsList.abbreviation,
        }),
      });

      setShowEditModal(false);
      setUnitsList({ id: 0, name: "", abbreviation: "" });
      fetchUnits();
      showSuccess("Unité mise à jour avec succès");
    } catch (error: any) {
      showError("Erreur lors de la mise à jour de l'unité: " + error.message);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreate = async (newUnit: any) => {
    setUnits((oldUnits) => [...oldUnits, newUnit]);
    showSuccess("Unité créée avec succès");
  };
  const onChangeUnits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnitsList((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div>
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2 cursor-pointer"
          onClick={toggleModal}
        >
          Créer un unité
        </button>
      </div>
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4  border border-gray-500">Nom</th>
            <th className="py-2 px-4  border border-gray-500">Abréviation</th>
            <th className="py-2 px-4  border border-gray-500">Action</th>
          </tr>
        </thead>
        <tbody className="darkBody">
          {units.length === 0 ? (
            <tr className="text-center">
              <td colSpan={6} className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucune unité disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            units
              .sort((a, b) => b.id - a.id)
              .map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-700 text-center">
                  <td className="py-2 px-4  border border-gray-500">
                    {unit.name.toLowerCase()}
                  </td>
                  <td className="py-2 px-4  border border-gray-500">
                    {unit.abbreviation.toLowerCase()}
                  </td>
                  <td className="py-2 px-4 flex flex-row gap-2 justify-center  border border-gray-500">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleEdit(unit)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600 cursor-pointer"
                      onClick={() => confirmDelete(unit.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      <CreateUnit
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onCreate={handleCreate}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
              <p className="mb-6 p-6">
                Êtes-vous sûr de vouloir supprimer l&apos;unité{" "}
                {unitToDelete?.name} ?
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
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4"> Modifier l&apos;unité</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <form
              onSubmit={handleUpdateUnit}
              className="p-6 flex flex-col gap-3"
            >
              <input
                type="text"
                value={unitsList.name}
                name="name"
                onChange={onChangeUnits}
                placeholder="Nom de l'unité"
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              />
              <input
                type="text"
                value={unitsList.abbreviation}
                name="abbreviantion"
                onChange={onChangeUnits}
                placeholder="Abréviation de l'unité"
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              />
              <div className="flex justify-between">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitsList;
