"use client";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdEdit, MdInfoOutline } from "react-icons/md";
import TextField from "@mui/material/TextField";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import { convertStatusToTable } from "@/lib/convertStatus";
import EditTable from "@/components/updateTable/page";

export type TableType = {
  id: number;
  number: number;
  capacity: number;
  status: string;
};

function TablesList() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [tableCapacity, setTableCapacity] = useState<string>("");
  const [tableStatus, setTableStatus] = useState<string>("");
  const [tableStatuses, setTableStatuses] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [tableToDelete, setTableToDelete] = useState<TableType | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showEditTableModal, setShowEditTableModal] = useState<boolean>(false);
  const [tableToEdit, setTableToEdit] = useState<TableType | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchTables = async () => {
    try {
      const res = await fetch(generatePath("/tables/all"));
      if (!res.ok) return;
      const data: TableType[] = await res.json();
      setTables(data);
      showSuccess("la tables a été bien récupéré.");
    } catch (error) {
      showError("Erreur lors de la récupération des tables.");
    }
  };

  const fetchTableStatuses = async () => {
    try {
      const res = await fetch(generatePath("/tables/status"));
      if (!res.ok) {
        showError(" récupération des statuts de table failed.");
      }
      const data = await res.json();
      setTableStatuses(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statuts de table:",
        error
      );
      showError("Erreur lors de la récupération des statuts de table.");
    }
  };

  useEffect(() => {
    void fetchTables();
    void fetchTableStatuses();
  }, []);

  const handleCreateTable = async () => {
    try {
      await fetch(generatePath(`/tables`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: tableNumber,
          capacity: tableCapacity,
          status: tableStatus,
        }),
      });
      setShowCreateModal(false);
      showSuccess("Table crée avec succès.");
      resetForm();
      void fetchTables();
    } catch (error) {
      console.error("Erreur lors de la création de la table:", error);
      showError("Erreur lors de la création de la table.");
    }
  };

  const resetForm = () => {
    setTableNumber("");
    setTableCapacity("");
    setTableStatus("");
  };

  const confirmDelete = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId) || null;
    setTableToDelete(table);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!tableToDelete) return;
    try {
      await fetch(generatePath(`/tables/${tableToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchTables();
      showSuccess("Table supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la table:", error);
      showError("Erreur lors de la suppression de la table.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  const handleEditStatus = (table: TableType) => {
    setSelectedTableId(table?.id);
    setTableStatus(table.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await fetch(generatePath(`/tables/status`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTableId, status: tableStatus }),
      });
      setShowEditModal(false);
      setSelectedTableId(null);
      void fetchTables();
      showSuccess("Statut de la table mis à jour avec succès.");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de la table:",
        error
      );
      showError("Erreur lors de la mise à jour du statut de la table.");
    }
  };

  const filteredTables = tables.filter(
    (table) =>
      table.number.toString().includes(searchTerm) ||
      table.capacity.toString().includes(searchTerm) ||
      table.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTable = (table: TableType) => {
    setTableToEdit(table || {});
    setShowEditTableModal(true);
  };

  const handleUpdateTable = async () => {
    console.log("Mise à jour du table:", tableToEdit);
    if (!tableToEdit || !tableToEdit.number || !tableToEdit.capacity) {
      console.error("Les informations du table sont incomplètes.");
      showError("Les informations du table sont incomplètes.");
      return;
    }

    try {
      const url = generatePath("/tables");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du table: ${response.statusText}`
        );
      }

      setShowEditTableModal(false);
      void fetchTables();
      showSuccess("Table mise à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du table:", error);
      showError("Erreur lors de la mise à jour du table.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold mb-4">Liste des Tables</h1>
        <button
          className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2 mb-4 cursor-pointer"
          onClick={() => setShowCreateModal(true)}
        >
          Créer Table
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un table"
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

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Numéro</th>
            <th className="py-2 px-4 border border-gray-500">Capacité</th>
            <th className="py-2 px-4 border border-gray-500">Statut</th>
            <th className="py-2 px-4 border border-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTables.length === 0 ? (
            <tr className="text-center">
              <td colSpan={7} className="py-4 text-gray-500">
                <div className="flex justify-center items-center flex-col">
                  <MdInfoOutline className="text-4xl inline-block mb-2 text-gray-400" />
                  Aucune table disponible
                </div>
              </td>
            </tr>
          ) : (
            filteredTables
              .toSorted((a, b) => b.id - a.id)
              .map((table) => (
                <tr key={table.id} className="hover:bg-gray-700 text-center">
                  <td className="py-3 px-4 border border-gray-500">
                    {table.number}
                  </td>
                  <td className="py-3 px-4 border border-gray-500">
                    {table.capacity}
                  </td>
                  <td
                    className={`py-2 px-4 cursor-pointer border border-gray-500 ${
                      table.status.toLowerCase() !== "available"
                        ? "text-red-500 font-bold"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => handleEditStatus(table)}
                      className="w-full flex flex-col gap-1 items-center cursor-pointer"
                    >
                      <span className="flex flex-row gap-1 items-center ">
                        <MdEdit />{" "}
                        {table.status.toLowerCase() !== "available" && (
                          <span className="text-red-500 text-[10px]">⚠️ </span>
                        )}
                        {convertStatusToTable(table.status)}
                      </span>
                    </button>
                  </td>
                  <td className="py-2 px-4 flex flex-row gap-4 justify-center border border-gray-500">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleEditTable(table)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600 cursor-pointer"
                      onClick={() => confirmDelete(table.id)}
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
          <div className="p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer la table n°
              {tableToDelete?.number} ?
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Créer une Table</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowCreateModal(false)}
              >
                x
              </span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Numéro de la table"
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              />
              <input
                type="number"
                value={tableCapacity}
                onChange={(e) => setTableCapacity(e.target.value)}
                placeholder="Capacité de la table"
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              />
              <select
                value={tableStatus}
                onChange={(e) => setTableStatus(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              >
                <option value="" disabled className="bg-gray-700">
                  Sélectionner le statut
                </option>
                {tableStatuses.map((status) => (
                  <option key={status} value={status} className="bg-gray-700">
                    {convertStatusToTable(status)}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </button>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  onClick={handleCreateTable}
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="p-6 flex flex-col gap-4">
              <select
                value={tableStatus}
                onChange={(e) => setTableStatus(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
              >
                {tableStatuses.map((status) => (
                  <option key={status} value={status} className="bg-gray-700">
                    {convertStatusToTable(status)}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  onClick={handleUpdateStatus}
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditTableModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <EditTable
              tableToEdit={tableToEdit}
              setTableToEdit={setTableToEdit}
              onSave={handleUpdateTable}
              onCancel={() => setShowEditTableModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TablesList;
