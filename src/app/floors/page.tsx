"use client";

import { useEffect, useState } from "react";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { generatePath } from "@/lib/config";
import CreateFloor from "@/components/floor/creatFloor/page";
import { truncate } from "@/lib/truncate";
import EditFloor from "@/components/floor/updateFloor/page";
import useToast from "@/lib/useToast";
import type { FloorType } from "@/lib/types";


const FloorsList = () => {
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showEditFloorModal, setShowEditFloorModal] = useState<boolean>(false);
  const [floorToEdit, setFloorToEdit] = useState<FloorType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [floorToDelete, setFloorToDelete] = useState<FloorType | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    void fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const res = await fetch(generatePath("/floors"));
      const data: FloorType[] = await res.json();
      setFloors(data);
      setFloors(data.toSorted((a, b) => a.id - b.id));
    } catch (err: any) {
      const errorMsg =
        err.message || "Erreur lors de la récupération des étages";
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFloorCreated = () => {
    void fetchFloors();
    setIsModalOpen(false);
  };

  const handleEditFloor = (floor: FloorType) => {
    setFloorToEdit(floor || {});
    setShowEditFloorModal(true);
  };

  const handleUpdateFloor = async () => {
    console.log("Mise à jour de l'étage:", floorToEdit);
    if (!floorToEdit || !floorToEdit.floorNumber || !floorToEdit.description) {
      console.error("Les informations du menu sont incomplètes.");
      showError("Les informations du menu sont incomplètes.");
      return;
    }

    try {
      console.log(floorToEdit);
      const url = generatePath(`/floors/${floorToEdit.id}`);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(floorToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `error lors de la mise à jour de l'étage: ${response.statusText}`
        );
      }

      setShowEditFloorModal(false);
      void fetchFloors();
      showSuccess("Étage mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étage:", error);
      showError("Erreur lors de la mise à jour de l'étage");
    }
  };

  const handleDelete = async () => {
    if (!floorToDelete) {
      return;
    }

    try {
      await fetch(generatePath(`/floors/${floorToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchFloors();
      showSuccess("Étage supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étage:", error);
      showError("Erreur lors de la suppression de l'étage");
    }
  };

  const confirmDelete = (floorId: number) => {
    const floor = floors.find((f) => f.id === floorId) || null;
    setFloorToDelete(floor);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFloorToDelete(null);
  };

  const onEditFloor = (newFloor: FloorType) =>{
    setFloorToEdit(newFloor)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des étages</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-row gap-4">
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Créer un étage
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                {" "}
                Créer une nouvelle étage
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </span>
            </div>
            <CreateFloor
              onCreate={handleFloorCreated}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">N° étage</th>
            <th className="py-2 px-4 border border-gray-500">Description</th>
            <th className="py-2 px-4 border border-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {floors.length > 0 ? (
            floors
              .toSorted((a, b) => a.id - b.id)
              .map((floor) => (
                <tr key={floor.id} className="hover:bg-gray-700 text-center">
                  <td className="py-3 px-4 border border-gray-500">
                    {floor.floorNumber}
                  </td>
                  <td className="py-3 px-4 border border-gray-500">
                    {truncate(floor.description, 40)}
                  </td>
                  <td className="py-3 px-4 border border-gray-500">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleEditFloor(floor)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2 cursor-pointer"
                      onClick={() => confirmDelete(floor.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr className="hover:bg-gray-100 text-center border-y">
              <td colSpan={8} className="py-4 text-gray-500  ">
                <p className="flex flex-col items-center justify-center w-full">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <span>Aucun étage trouvé</span>
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showEditFloorModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Modifier le n° d'étage
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditFloorModal(false)}
              >
                x
              </span>
            </div>
           {floorToEdit && 
            ( <EditFloor 
              floorToEdit={floorToEdit}
              onEditFloor={onEditFloor}
              onSave={handleUpdateFloor}
              onCancel={() => setShowEditFloorModal(false)}
            />)
           }
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 p-6">
            <p>
              Voulez-vous vraiment supprimer étage n°
              {floorToDelete?.floorNumber} ?
            </p>
            <div className="mt-4 flex justify-between items-center">
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

export default FloorsList;
