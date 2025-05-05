"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";

const unitSchema = z.object({
  name: z.string().min(1, "Le nom de l'unité est requis"),
  abbreviation: z.string().min(1, "L'abréviation est requise"),
});

type PropsType = {
  setIsModalOpen: any;
  onCreate: any;
  isModalOpen: any;
};

function CreateUnit({ isModalOpen, setIsModalOpen, onCreate }: PropsType) {
  const { showError } = useToast();
  const {
    register: registerUnit,
    handleSubmit: handleSubmitUnit,
    formState: { errors: unitErrors },
    reset: resetUnitForm,
  } = useForm({
    resolver: zodResolver(unitSchema),
  });

  const onSubmitUnit = async (data: any) => {
    try {
      const url = generatePath("/units");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'unité");
      }

      const savedUnit = await response.json();
      await onCreate(savedUnit);
      setIsModalOpen(false);
      resetUnitForm();
    } catch (error: any) {
      console.error("Erreur lors de la soumission de l'unité:", error);
      showError("Erreur lors de la création de l'unité.");
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-md shadow-md w-[90%] sm:w-[400px] md:w-[500px] bg-gray-800">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl pl-8 pt-8 pb-4">Créer une nouvelle unité</h2>
          <span
            className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            x
          </span>
        </div>
        <form onSubmit={handleSubmitUnit(onSubmitUnit)} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="unitName"
              className="block text-sm font-medium text-start"
            >
              Nom de l&apos;unité
            </label>
            <input
              id="unitName"
              type="text"
              {...registerUnit("name")}
              className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0 
             ${unitErrors.name ? "border-red-500" : ""}`}
            />
            {unitErrors.name && (
              <p className="text-red-500 text-sm">{unitErrors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="abbreviation"
              className="block text-sm font-medium text-start"
            >
              Abréviation
            </label>
            <input
              id="abbreviation"
              type="text"
              {...registerUnit("abbreviation")}
              className={`mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0
             ${unitErrors.abbreviation ? "border-red-500" : ""}`}
            />
            {unitErrors.abbreviation && (
              <p className="text-red-500 text-sm">
                {unitErrors.abbreviation.message}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-4 sm:gap-8 lg:gap-16 xl:gap-44">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
      </div>
    </div>
  );
}

export default CreateUnit;
