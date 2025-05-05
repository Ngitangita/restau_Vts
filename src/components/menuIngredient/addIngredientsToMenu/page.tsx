"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { MdDelete } from 'react-icons/md';
import useToast from '@/lib/useToast';
import { generatePath } from '@/lib/config';
import { useParams, useRouter } from 'next/navigation';

interface Ingredient {
  id: number;
  name: string;
}

interface IngredientQuantity {
  ingredientId: number;
  name: string;
  quantity: number;
}

interface AddIngredientsToMenuProps {
  onAddIngredients: () => void;
  ingredients: Ingredient[];
  closeModal: () => void;
}

interface MenuParams {
  menuId?: string;
}

const AddIngredientsToMenu: React.FC<AddIngredientsToMenuProps> = ({
  onAddIngredients,
  ingredients,
  closeModal,
}) => {
  const [ingredientQuantities, setIngredientQuantities] = useState<IngredientQuantity[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);

  const { showError, showSuccess } = useToast();
  const params = useParams();
  const menuId = typeof params?.menuId === 'string' ? params.menuId : undefined;
  const router = useRouter();

  useEffect(() => {
    setIngredientQuantities([]);
  }, [ingredients]);

  const addIngredient = () => {
    if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
      showError('Sélectionnez un ingrédient et entrez une quantité valide.');
      return;
    }

    const existingIngredient = ingredientQuantities.find(
      (iq) => iq.ingredientId === selectedIngredient.id
    );

    if (existingIngredient) {
      const updatedIngredients = ingredientQuantities.map((iq) =>
        iq.ingredientId === selectedIngredient.id
          ? { ...iq, quantity: iq.quantity + parseFloat(quantity) }
          : iq
      );

      setIngredientQuantities(updatedIngredients);
    } else {
      const newIngredient: IngredientQuantity = {
        ingredientId: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: parseFloat(quantity),
      };

      setIngredientQuantities([...ingredientQuantities, newIngredient]);
    }

    setSelectedIngredient(null);
    setQuantity('');
  };

  const toggleDeleteMode = (ingredientId: number) => {
    if (selectedForDeletion.includes(ingredientId)) {
      setSelectedForDeletion(selectedForDeletion.filter((id) => id !== ingredientId));
    } else {
      setSelectedForDeletion([...selectedForDeletion, ingredientId]);
    }
  };

  const handleIngredientClick = (ingredientId: number) => {
    toggleDeleteMode(ingredientId);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>, ingredientId: number) => {
    const updatedQuantity = parseFloat(e.target.value);

    if (isNaN(updatedQuantity) || updatedQuantity < 0) {
      return;
    }

    const updatedIngredients = ingredientQuantities.map((ingredient) =>
      ingredient.ingredientId === ingredientId
        ? { ...ingredient, quantity: updatedQuantity }
        : ingredient
    );

    setIngredientQuantities(updatedIngredients);
  };

  const removeSelectedIngredients = () => {
    setIngredientQuantities(
      ingredientQuantities.filter((iq) => !selectedForDeletion.includes(iq.ingredientId))
    );
    setSelectedForDeletion([]);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!menuId || ingredientQuantities.length === 0) {
      showError(
        "Veuillez sélectionner un menu et ajouter au moins un ingrédient."
      );
      return;
    }

    const menuIngredientsData = {
      menuId: parseInt(menuId, 10),
      ingredients: ingredientQuantities.map(({ ingredientId, quantity }) => ({
        ingredientId,
        quantity,
      })),
    };

    try {
      const response = await fetch(generatePath("/menus/add-ingredients"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuIngredientsData),
      });

      if (response.ok) {
        showSuccess("Ingrédients ajoutés avec succès !");
        onAddIngredients();
        closeModal();
        router.push(`/menu-ingredients/menu/${menuId}`);
      } else {
        showError("Erreur lors de l’ajout des ingrédients au menu.");
      }
    } catch {
      showError("Erreur lors de l’envoi des données.");
    }
  };
  

  return (
    <form onSubmit={onSubmit} className='p-6'>
      <div className='flex flex-row gap-2'>
        <Autocomplete
          options={ingredients}
          getOptionLabel={(option) => option.name || ''}
          value={selectedIngredient}
          onChange={(event, newValue) => setSelectedIngredient(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Ingrédient" placeholder="Sélectionnez un ingrédient..."/>
          )}
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

        <TextField
          label="Quantité"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "150px",
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

        <button
          type="button"
          onClick={addIngredient}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mb-2 cursor-pointer"
        >
          Ajouter l&apos;ingrédient
        </button>
      </div>

      <ul className="mt-4 pb-5">
        {ingredientQuantities.map((ingredient) => (
          <li
            key={ingredient.ingredientId}
            className={`flex items-center cursor-pointer hover:bg-gray-100 text-center dark:hover:bg-gray-600 ${
              selectedForDeletion.includes(ingredient.ingredientId) ? 'bg-gray-200' : ''
            } transition-all`}
            onClick={() => handleIngredientClick(ingredient.ingredientId)}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedForDeletion.includes(ingredient.ingredientId)}
              onChange={() => toggleDeleteMode(ingredient.ingredientId)}
            />
            {ingredient.name} -
            <input
              type="number"
              min="0"
              value={ingredient.quantity}
              className="mx-2 border px-2 py-1 rounded w-[6em] focus:outline-1 focus:outline-blue-600"
              onChange={(e) => handleQuantityChange(e, ingredient.ingredientId)}
            />

            {selectedForDeletion.includes(ingredient.ingredientId) && (
              <button
                type="button"
                onClick={removeSelectedIngredients}
                className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
              >
                <MdDelete />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap flex-row justify-between z-50">
        <button
          type="button"
          onClick={closeModal}
           className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
        >
          Annuler
        </button>

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer">
          Soumettre
        </button>
      </div>
    </form>
  );
};

export default AddIngredientsToMenu;
