import { Dispatch, SetStateAction } from "react";

type PropsTypes = {
  // units,
  ingredientName: string | null;
  setIngredientName: Dispatch<SetStateAction<string | null>>;
  unitId: number | null;
  setUnitId: Dispatch<SetStateAction<number | null>>;
  onSave: () => void;
  onCancel: () => void;
  error:  string | null;
};

const EditIngredients = ({
//   units,
  ingredientName,
  setIngredientName,
  unitId,
  setUnitId,
  onSave,
  onCancel,
  error,
}: PropsTypes) => {
  return (
    <div className="p-8">
      <input
        type="text"
        value={ingredientName || ""}
        onChange={(e) => setIngredientName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      {/* <select
          value={unitId || ""}
          onChange={(e) => setUnitId(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Sélectionner une unité</option>
          {units && units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.abbreviation}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 mb-4">{error}</p>} */}

      <div className="flex justify-between">
        <button
          className="bg-red-300 text-gray-700 px-4 py-2 rounded hover:bg-red-400"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          onClick={onSave}
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default EditIngredients;
