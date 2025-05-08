"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { MdEdit, MdInfoOutline } from "react-icons/md";
import useToast from "@/lib/useToast";
import { generatePath } from "@/lib/config";
import CreateStock from "@/components/createStock/page";
import OperationStockDetails from "../operationDetails/page";
import { number } from "zod";

interface Ingredient {
  id: string;
  name: string;
  stock: {
    id: number
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
  unit: {
    abbreviation: string;
  };
}

interface Stock {
  name: string;
  ingredients: Ingredient[];
  total: number;
}

interface OperationDetailsModalProps {
  operationId: number;
  onClose: () => void;
}

const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  (e.target as HTMLInputElement).blur();
};

function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [ingredientName, setIngredientName] = useState<string>("");
  const [quantityMin, setQuantityMin] = useState<string>("");
  const [quantityMax, setQuantityMax] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<Ingredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [, setOperationDetails] = useState<null | any>(null);
  const [selectedOperationId, setSelectedOperationId] = useState<number | null>(
    null
  );
  const { showError } = useToast();

  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(generatePath("/ingredient-groups"));
      const data = await response.json();
      const fifoCosts = await Promise.all(
        data.flatMap((group: any) =>
          group.ingredients.map(async (ingredient: any) => {
            const cost = await fetchFifoCost(ingredient.id);
            return { ingredientId: ingredient.id, cost };
          })
        )
      );

      const updatedData = data.map((group: any) => ({
        ...group,
        ingredients: group.ingredients.map((ingredient: any) => ({
          ...ingredient,
          fifoCost:
            fifoCosts.find(
              (costObj: any) => costObj.ingredientId === ingredient.id
            )?.cost || 0,
        })),
      }));

      const finalData = updatedData.map((u: any) => ({
        ...u,
        total: u.ingredients.reduce(
          (acc: number, v: any) => acc + v.fifoCost,
          0
        ),
      }));

      setStocks(finalData);
    } catch (error: any) {
      showError(
        "Une erreur s'est produite lors du chargement des stocks: " +
          error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFifoCost = async (stockId: string) => {
    try {
      const url = generatePath(`/purchases/${stockId}/fifo-cost`);
      const res = await fetch(url);
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text);
      }
      return parseFloat(text);
    } catch (error: any) {
      showError(`Erreur coût FIFO pour stock ${stockId}: ` + error.message);
      return 0;
    }
  };

  useEffect(() => {
    void fetchStocks();
  }, []);

  const toggleModal = (ingredient: Ingredient) => {
    setSelectedStock(ingredient);
    setIsModalOpen(true);
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchOperationDetails = (stockId: number) => {
    setSelectedOperationId(stockId);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setOperationDetails(null);
  };

  const handleStockCreated = () => {
    void fetchStocks();
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const filteredData = stocks.map((s) => ({
    ...s,
    ingredients: s.ingredients.filter((i) => {
      const nameMatch = ingredientName
        ? i?.name?.toLowerCase().includes(ingredientName.toLowerCase())
        : true;
      const quantityMatch =
        (!quantityMin || i.stock.quantity >= parseInt(quantityMin)) &&
        (!quantityMax || i.stock.quantity <= parseInt(quantityMax));

      const createdDate = i.stock.createdAt.split("T")[0];
      const updatedDate = i.stock.updatedAt.split("T")[0];
      const start = startDate ? startDate.split("T")[0] : null;
      const end = endDate ? endDate.split("T")[0] : null;

      const dateMatch =
        (!start || createdDate >= start) && (!end || updatedDate <= end);

      return nameMatch && quantityMatch && dateMatch;
    }),
  }));

  return (
    <div>
      <div>
        <div className="flex flex-row items-center gap-20">
          <h1 className="text-2xl font-bold mb-4">Liste des Stocks</h1>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <div className="w-auto flex-wrap flex flex-col sm:flex-row sm:space-x-2 mb-4 p-2">
          <TextField
            id="outlined-search"
            label="Rechercher par nom de l'ingredient"
            type="search"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: ingredientName && (
                <button
                  type="button"
                  className="flex items-center"
                  onClick={() => setIngredientName("")}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                ></button>
              ),
            }}
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

          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full">
            <input
              type="number"
              placeholder="Quantité Min"
              value={quantityMin}
              onChange={(e) => setQuantityMin(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
            />

            <input
              type="number"
              placeholder="Quantité Max"
              value={quantityMax}
              onChange={(e) => setQuantityMax(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
            />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={(e) => (e.target as HTMLInputElement).blur()}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
            />

            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={(e) => (e.target as HTMLInputElement).blur()}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
            />
          </div>
        </div>
      </div>
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4 border border-gray-500">Créé le</th>
            <th className="py-2 px-4 border border-gray-500">Modifié le</th>
            <th className="py-2 px-4 border border-gray-500">Ingrédient</th>
            <th className="py-2 px-4 border border-gray-500">Quantité</th>
            <th className="py-2 px-4 border border-gray-500">Unité</th>
            <th className="py-2 px-4 border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-2">
                Chargement...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center py-2 text-red-500">
                {error}
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map(({ name, ingredients, total }, i) => (
              <React.Fragment key={i}>
                <tr className="text-gray-500 font-bold text-center">
                  <td colSpan={3}>{name}</td>
                  <td colSpan={3}>Total prix: {total} Ar</td>
                </tr>
                {ingredients.map((ingredient) => (
                  <tr
                    key={ingredient.id}
                    className="hover:bg-gray-700 text-center"
                  >
                    <td className="py-3 px-4 border border-gray-500">
                      {ingredient?.stock?.createdAt
                        ? dayjs(ingredient.stock.createdAt).format(
                            "YYYY-MM-DD HH:mm"
                          )
                        : "Non défini"}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {dayjs(ingredient?.stock?.updatedAt).format(
                        "YYYY-MM-DD HH:mm"
                      )}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {ingredient?.name}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {ingredient?.stock?.quantity}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {ingredient?.unit?.abbreviation}
                    </td>
                    <td className="py-3 px-4 border border-gray-500 flex justify-center text-sm sm:text-base">
                        <button
                          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2 cursor-pointer"
                          onClick={() => toggleModal(ingredient)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="bg-green-500 text-white rounded p-2 hover:bg-green-600 cursor-pointer"
                          onClick={() =>
                            fetchOperationDetails(Number(ingredient.stock.id))
                          }
                        >
                          <MdInfoOutline /> 
                        </button>
                      </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-2">
                Aucun stock disponible pour les filtres appliqués.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showDetailsModal && selectedOperationId !== null && (
       <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
       <div className="rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 flex flex-col gap-3">
         <div className="flex flex-row justify-between items-center">
           <h2 className="text-xl pl-8 pt-8 pb-4">
                Détails de l&rsquo;Opération
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={closeDetailsModal}
              >
                x
              </span>
            </div>
            <OperationStockDetails
              operationId={selectedOperationId}
              onClose={closeDetailsModal}
            />
          </div>
        </div>
      )}

      {isModalOpen && selectedStock && (
       <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
       <div className="rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 flex flex-col gap-3">
         <div className="flex flex-row justify-between items-center">
           <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le stock</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={handleToggleModal}
              >
                x
              </span>
            </div>
            <CreateStock
              onStockCreated={handleStockCreated}
              createStockModale={handleToggleModal}
              ingredientId={selectedStock ? selectedStock.id : ""}
              ingredientName={selectedStock ? selectedStock.name : ""}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StockList;
