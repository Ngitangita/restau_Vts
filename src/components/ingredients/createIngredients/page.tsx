"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  unit: z.string({ message: "l'unité est requis" }),
  ingredientGroup: z.string({ message: "l'ingredient groups est requis" }),
});

type PropsType = { 
  onModalOpen: () => void ;
  onToggle: () => void }

type Types = {
  id: number;
  name: string;
}

type UniteTypes = {
  id: number;
  abbreviation: string;
}

function CreateIngredient({ onModalOpen, onToggle }: PropsType) {
  const [units, setUnits] = useState<UniteTypes[]>([]);
  const [ingredientGroups, setIngredientGroups] = useState<Types[]>([]);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchUnits = async () => {
    try {
      const res = await fetch(generatePath("/units/all"));
      if (!res.ok) {
        throw("Erreur lors de la récupération des unités")
      }
      const data: UniteTypes[] = await res.json()
      setUnits(data);
    } catch (error) {
      showError("Impossible de charger les unités");
    }
  };

  const fetchIngredientGroup = async () => {
    try {
      const res = await fetch(generatePath("/ingredients/groups"));
      if (!res.ok) {
        throw("Erreur lors de la récupération des ingredients groups")
      }
      const data: Types[] = await res.json();
      setIngredientGroups(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ingredients groups:",
        error
      );
      showError("Impossible de charger les ingredients groups");
    }
  };

  useEffect(() => {
    void fetchUnits();
    void fetchIngredientGroup();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await fetch(generatePath("/ingredients"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: data.name,
          unitId: parseInt(data.unit, 10),
          groupId: parseInt(data.ingredientGroup, 10),
        })
      });
      onModalOpen();
      showSuccess("Ingrédient créé avec succès");
      reset();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      showError("Erreur lors de la création de l'ingrédient");
    }
  };

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-0 p-4 w-full rounded-md"
      >
        <div className="mb-4">
          <label htmlFor="ingredientGroup" className="block text-gray-700">
            Catégorie des ingredients
          </label>
          <select
            id="ingredientGroup"
            {...register("ingredientGroup")}
            className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0 ${
              errors.ingredientGroup ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez la categorie des ingredients</option>
            {ingredientGroups.map((ingredientGroup) => (
              <option key={ingredientGroup.id} value={ingredientGroup.id}>
                {ingredientGroup.name}
              </option>
            ))}
          </select>
          {errors.ingredientGroup && (
            <p className="text-red-500 text-sm">
              {errors.ingredientGroup.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Nom
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-gray-700">
            Unité
          </label>
          <select
            id="unit"
            {...register("unit")}
            className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0 ${
              errors.unit ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez une unité</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.abbreviation}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm">{errors.unit.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-row gap-5 text-sm">
           <Link href="/units">
           <button
              type="button"
              className="text-blue-500"
            >
              Créer une nouvelle unité
            </button>
           </Link>
            <Link href="/ingredient_groups">
            <button
              type="button"
              className="text-blue-500"
            >
              Créer une nouvelle catégorie
            </button>
            </Link>
          </div>

          <div className="flex flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 mt-4">
            <button
              type="button"
              onClick={onToggle}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Soumettre
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateIngredient;
