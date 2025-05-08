"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdInfoOutline } from "react-icons/md";
import { generatePath } from "@/lib/config";
import { truncate } from "@/lib/truncate";

type PurchaseType = {
  id: number;
  ingredientName: string;
  ingredientId: string;
  quantity: number;
  cost: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type PageInfoType = {
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

type PurchaseResponseType = {
  items: PurchaseType[];
  pageInfo: PageInfoType;
};


function PurchaseList() {
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(8);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error] = useState(null);

  useEffect(() => {
    const url = `${generatePath("/purchases")}?size=${size}&page=${page - 1}&startDate=${startDate}&endDate=${endDate}`;
    fetch(url)
      .then((res) => res.json())
      .then((data: PurchaseResponseType) => {
        setPurchases(data.items);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [size, page, startDate, endDate]);
  

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = purchases.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );
    setTotalPrice(total);
  }, [purchases]);

  return (
    <div>
      {error && (
        <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      <div>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={() => {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
              active.blur();
            }
          }}
          
          className="border border-gray-300 p-2 rounded-md sm:mr-4 outline-none"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={() => {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
              active.blur();
            }
          }}
          
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
        <p className="mt-4 sm:mt-0 sm:ml-3 text-xl font-semibold">
          Prix total : {totalPrice} Ar
        </p>
      </div>

        <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
          <thead>
            <tr className="bg-gray-900">
              <th className="py-2 px-4 border border-gray-500">Nom Ingrédient</th>
              <th className="py-2 px-4 border border-gray-500">Quantité</th>
              <th className="py-2 px-4 border border-gray-500">Coût</th>
              <th className="py-2 px-4 border border-gray-500">Description</th>
              <th className="py-2 px-4 border border-gray-500">Créé à</th>
              <th className="py-2 px-4 border border-gray-500">Mis à jour à</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases
                .toSorted((a, b) => b.id - a.id)
                .map((purchase, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 text-center"
                  >
                    <td className="py-3 px-4 border border-gray-500">{purchase.ingredientName}</td>
                    <td className="py-3 px-4 border border-gray-500">{purchase.quantity}</td>
                    <td className="py-3 px-4 border border-gray-500">{purchase.cost} Ar</td>
                    <td className="py-3 px-4 border border-gray-500">
                      {truncate(purchase.description, 10)}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {dayjs(purchase.createdAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="py-3 px-4 border border-gray-500">
                      {dayjs(purchase.updatedAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                  </tr>
                ))
            ) : (
              <tr className="text-center">
                <td colSpan={6} className="py-4 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                    Aucune donnée disponible
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PurchaseList;
