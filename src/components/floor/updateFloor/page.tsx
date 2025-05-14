
type FloorType = {
  id: number;
  floorNumber: string;
  description: string;
};

type EditFloorType = {
  onSave: () => void;
  onCancel: () => void;
  floorToEdit: FloorType;
  onEditFloor: (newFloor: FloorType) => void;
};

const EditFloor = ({
  floorToEdit,
  onEditFloor,
  onSave,
  onCancel,
}: EditFloorType) => {
  return (
    <div className="p-6">
      
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="floorNumber">N° de l'étage:</label>
        <input
          id="floorNumber"
          type="number"
          placeholder="Numéro de l'étage"
          value={floorToEdit?.floorNumber || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onEditFloor({ ...floorToEdit, floorNumber: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="description">Déscription:</label>
        <textarea
          id="description"
          placeholder="description"
          value={floorToEdit?.description || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onEditFloor({ ...floorToEdit, description: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
        />
      </div>

      <div className="flex justify-between mt-2">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={onSave}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default EditFloor;
