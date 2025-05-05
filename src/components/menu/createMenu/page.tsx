import { CategoryTypes, MenuTypes } from "@/app/menus/page";
import { generatePath } from "@/lib/config";
import { convertStatusMenu } from "@/lib/convertStatus";
import useToast from "@/lib/useToast";
import { useState } from "react";

type PropsType = { 
  onCreate:(menu: MenuTypes) => void;
  createMenuModal: () => void
  categories: CategoryTypes[];
  statuses: string[] }

const CreateMenu = ({ onCreate, createMenuModal, categories, statuses }: PropsType) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !price || !categoryId || !status) {
      setErrorMessage("Tous les champs doivent être remplis.");
      showError("Tous les champs doivent être remplis.");
      return;
    }

    const parsedPrice = parseFloat(price);

if (isNaN(parsedPrice) || parsedPrice <= 0) {
  setErrorMessage("Le prix doit être un nombre positif.");
  showError("Le prix doit être un nombre positif.");
  return;
}

    const nouveauMenu = {
      name,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId, 10),
      status,
    };

    try {
      const response = await fetch(generatePath("/menus"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nouveauMenu),
      });

      if (response.ok) {
        const createdMenu = await response.json();
        onCreate(createdMenu);
        showSuccess("Menu créé avec succès!");
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setStatus("");
        setErrorMessage("");
      } else {
        setErrorMessage("Erreur lors de la création du menu.");
        showError("Erreur lors de la création du menu.");
      }
    } catch {
      setErrorMessage("Erreur lors de l'envoi des données.");
      showError("Erreur lors de l'envoi des données.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div>
        <label htmlFor="name">Nom:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full  px-3 py-2 border outline-none focus:border-blue-500 border-gray-300 rounded"
        />
      </div>

      <div>
        <label htmlFor="price">Prix:</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border outline-none focus:border-blue-500 border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="categoryId">Catégorie:</label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 border outline-none focus:border-blue-500 py-2 border-gray-300 rounded"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}>
                    {category.name}
                </option>
            ))
          ) : (
            <option value="">Aucune catégorie disponible</option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="status">Statut:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border outline-none focus:border-blue-500 px-3 py-2  border-gray-300 rounded"
          required
        >
          <option value="">Sélectionnez un statut</option>
          {statuses && statuses.length > 0 ? (
            statuses.map((status) => (
              <option key={status} value={status}>
                {convertStatusMenu(status.toLowerCase())}
              </option>
            ))
          ) : (
            <option value="">Aucun statut disponible</option>
          )}
        </select>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex flex-row gap-52 relative top-4">
        <button
          type="button"
          onClick={createMenuModal}
           className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer"
        >
          Créer
        </button>
      </div>
    </form>
  );
};

export default CreateMenu;
