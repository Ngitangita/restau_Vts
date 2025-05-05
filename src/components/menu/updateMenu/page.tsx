import { CategoryTypes, MenuTypes } from "@/app/menus/page";

type PropsType = {
  menuToEdit: MenuTypes | null;
  setMenuToEdit: React.Dispatch<React.SetStateAction<MenuTypes | null>>;
  categories: CategoryTypes[];
  onSave: () => Promise<void>;
  onCancel: () => void;
};

const EditMenu = ({
  menuToEdit,
  setMenuToEdit,
  categories,
  onSave,
  onCancel,
}: PropsType) => {
  if (!menuToEdit) {
    return <div>Menu introuvable</div>;
  }

  const handleInputChange = (field: keyof MenuTypes) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setMenuToEdit((prevState) => (prevState ? { ...prevState, [field]: value } : prevState));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{menuToEdit.id ? "Modifier" : "Créer"} un Menu</h2>

      <input
        type="text"
        placeholder="Nom"
        value={menuToEdit.name || ""}
        onChange={handleInputChange("name")}
        className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
      />

      <input
        type="number"
        placeholder="Prix"
        value={menuToEdit.price || ""}
        onChange={handleInputChange("price")}
        className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
      />

      <textarea
        placeholder="Description"
        value={menuToEdit.description || ""}
        onChange={handleInputChange("description")}
        className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
      />

      <select
        value={menuToEdit.categoryId || ""}
        onChange={handleInputChange("categoryId")}
        className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="flex justify-between">
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

export default EditMenu;
