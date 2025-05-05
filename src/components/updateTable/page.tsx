import { TableType } from "@/app/tables/page";
import { Dispatch, SetStateAction } from "react";

type PropsTableType = {
  tableToEdit: TableType | null;
  setTableToEdit: Dispatch<SetStateAction<TableType | null>>;
  onSave: () => void;
  onCancel: () => void;
};

const EditTable = ({
  tableToEdit,
  setTableToEdit,
  onSave,
  onCancel,
}: PropsTableType) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl pl-8 pt-8 pb-4">
          {tableToEdit?.id ? "Modifier" : "Créer"} un Table
        </h2>
        <span
          className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                  relative bottom-4 text-[30px] hover:text-white cursor-pointer"
          onClick={onCancel}
        >
          x
        </span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <input
          type="number"
          placeholder="Numéro de la table"
          value={tableToEdit?.number || ""}
          onChange={(e) =>
            setTableToEdit({ ...tableToEdit, number: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
        />
        <input
          type="number"
          placeholder="Capacité de la table"
          value={tableToEdit?.capacity || ""}
          onChange={(e) =>
            setTableToEdit({ ...tableToEdit, capacity: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
        />

        <div className="flex justify-between">
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={onSave}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTable;
