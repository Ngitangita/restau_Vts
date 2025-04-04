import { CategoriesType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

type PropsType = { 
    onSave: () => void; 
    onCancel: () => void; 
    setCategoryToEdit: Dispatch<SetStateAction<CategoriesType | null>>; 
    categoryToEdit: CategoriesType | null };

const UpdateCategorieIngredient = ({
  onSave,
  onCancel,
  setCategoryToEdit,
  categoryToEdit,
}: PropsType) => {
  if (!categoryToEdit) return null;

  return (
    <div className="p-6">
      <input
        type="text"
        value={categoryToEdit?.name || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCategoryToEdit({ ...categoryToEdit, name: e.target.value })
        }
        className="p-2 border outline-none focus:border-blue-500  border-gray-300 rounded-md w-full mb-4"
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          onClick={onSave}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default UpdateCategorieIngredient;
