import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@/lib/useToast';
import { generatePath } from '@/lib/config';

const schema = z.object({
  quantity: z.preprocess((val) => parseFloat(String(val)), z.number().positive("La quantité doit être > 0")),
  cost: z.preprocess((val) => parseFloat(String(val)), z.number().positive("Le coût doit être > 0")),
  description: z.string().max(255, "La description ne doit pas dépasser 255 caractères").optional(),
  method: z.string().min(1, "La méthode de paiement est requise"),
  ingredientId: z.string(),
});

type CreateStockProps = {
  onStockCreated?: (() => void);
  createStockModale: () => void;
  ingredientId: string;
  ingredientName: string;
};

type FormValues = z.infer<typeof schema>; 

function CreateStock({ onStockCreated, createStockModale, ingredientId, ingredientName }: CreateStockProps) {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [methods, setMethods] = useState<string[]>([]);
  const { showSuccess, showError } = useToast();
  const quantity = watch("quantity") || "0";
  const cost = watch("cost") || "0";

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(generatePath("/payments/method"));
        const data = await response.json();
        setMethods(data);
      } catch {
        showError("Failed to fetch payment methods");
      }
    };

    fetchPaymentMethods();

    if (ingredientId) {
      setValue("ingredientId", ingredientId);
    }
  }, [ingredientId, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formattedData = {
      ...data,
      ingredientId,
      quantity: parseFloat(data.quantity),
      cost: parseFloat(data.cost),
    };

    try {
      const url = generatePath("/stocks/add");
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formattedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      showSuccess("Stock ajouté avec succès !");
      onStockCreated?.();
      reset();
    } catch (error) {
      if (error instanceof Error) {
        const jsonErr = JSON.parse(error.message);
        const message = jsonErr?.message;
        showError(message || "Fonds insuffisants pour ce retrait.");
      } else {
        showError("Erreur lors de l'ajout du stock.");
      }

      console.error(error);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(String(quantity)) || 0;
    const price = parseFloat(String(cost)) || 0;
    return (qty * price).toFixed(2);
  };
  

  const convertMethodToPayment = (method: string) => {
    return method;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className='flex flex-row gap-20'>
        <div>
          <label htmlFor="ingredient" className="text-start">Ingrédient</label>
          <input
            id="ingredient"
            type="text"
            value={ingredientName}
            readOnly
            className={`w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded
               ${errors.ingredientId ? 'border-red-500' : 'border-gray-300'}`} />
          <input
            type="hidden"
            value={ingredientId}
            {...register("ingredientId", { required: true })}
          />
          {errors.ingredientId && <p className="text-red-500">{errors.ingredientId.message}</p>}
        </div>

        <div>
          <label htmlFor="method" className="text-start">Forme de paiement</label>
          {methods.length > 0 ? (
            <select
              id="method"
              {...register("method")}
              className={`w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded
                 ${errors.method ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option disabled value="">Sélectionner une méthode</option>
              {methods.map((item) => (
                <option value={item} key={item}> {convertMethodToPayment(item)}</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">Aucune méthode de paiement disponible</p>
          )}
          {errors.method && <p className="text-red-500">{errors.method.message}</p>}
        </div>
      </div>
      <div className='flex flex-row gap-20'>
        <div>
          <label htmlFor="quantity" className="text-start">Quantité</label>
          <input
            id="quantity"
            type="text"
            {...register("quantity")}
            className={`w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded
               ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
        </div>

        <div>
          <label htmlFor="cost" className='text-start'>Prix Unitaire</label>
          <input
            id="cost"
            type="text"
            {...register("cost")}
            className={`w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded
               ${errors.cost ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className='text-start'>Description (facultatif)</label>
        <textarea
          id="description"
          {...register("description")}
          className={`w-full outline-none focus:border-blue-500 px-3 py-2 border border-gray-300 rounded
             ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div className="mt-2 text-gray-500 font-semibold">
        Total prix {ingredientName} {calculateTotal()} Ar
      </div>

      <div className="flex flex-row gap-40">
        <button
          type="button"
          onClick={createStockModale}
                     className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
        >
          Annuler
        </button>
        <button type="submit"  className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer">
          Soumettre
        </button>
      </div>
    </form>
  );
}

export default CreateStock;
