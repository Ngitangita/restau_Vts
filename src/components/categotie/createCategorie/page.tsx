"use client";
import { generatePath } from "@/lib/config";
import useToast from "@/lib/useToast";
import { FieldError, useForm } from "react-hook-form";

type PropsType = {
  onClose: () => void;
  onCategoryCreated: () => void;
};

const CreateCategories = ({ onClose, onCategoryCreated }: PropsType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showSuccess, showError } = useToast();
  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(generatePath("/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la création du catégorie");
      }
      const json = await res.json();
      onCategoryCreated();
      onClose();
      showSuccess("Catégorie a été créé avec succè");
    } catch (error) {
      showError("Erreur lors de la création de l'unité.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-start">
          Nom de la catégorie
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Le nom est requis" })}
          className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0
                         ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{(errors.name as FieldError).message || "Une erreur s'est produite."}</p>}
          
      </div>
      <div className="flex flex-row justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
        >
          Annuler
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Créer
        </button>
      </div>
    </form>
  );
};

export default CreateCategories;
