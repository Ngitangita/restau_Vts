"use client";

import { generatePath } from "@/lib/config";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";

type CustomerType = {
  id: number;
  name: string;
  phoneNumber: string;
};

type PageInfoType = {
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

type PurchaseResponseType = {
  items: CustomerType[];
  pageInfo: PageInfoType;
};

function CustomerList() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [size] = useState(8);
  const [customerData, setCustomerData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const url = `${generatePath("/customers")}?size=${size}&page=${page - 1}`;
    fetch(url)
      .then((res) => res.json())
      .then((data: PurchaseResponseType) => {
        setCustomers(data.items);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [size, page]);

  const confirmDelete = (id: number) => {
    setSelectedCustomer(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(generatePath(`/customers/${selectedCustomer}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      setPage(1);
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer: CustomerType) => {
    setSelectedCustomer(customer.id);
    setCustomerData({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      await fetch(generatePath(`/customers/${selectedCustomer}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerData.name,
          phoneNumber: customerData.phoneNumber,
        }),
      });
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md ">
        <thead>
          <tr className="bg-gray-900">
            <th className="py-2 px-4  border border-gray-500">Prénom</th>
            <th className="py-2 px-4  border border-gray-500">Téléphone</th>
            <th className="py-2 px-4  border border-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr className="hover:bg-gray-700 text-center">
              <td colSpan={6} className="py-2 px-4  border border-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucun client disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-700 text-center">
                <td className="py-2 px-4  border border-gray-500">
                  {customer.name}
                </td>
                <td className="py-2 px-4  border border-gray-500">
                  {customer.phoneNumber}
                </td>
                <td className="py-2 px-4 flex flex-row gap-2 justify-center border border-gray-500">
                  <button
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    onClick={() => handleEdit(customer)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                    onClick={() => confirmDelete(customer.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800">
            <p className="mb-6 p-6">
              Êtes-vous sûr de vouloir supprimer ce client ?
            </p>
            <div className="flex justify-around">
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Annuler
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center bg-gray-800 flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le client</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <div className="p-6">
            {Object.keys(customerData).map((key) => (
              <input
                key={key}
                name={key}
                type={key === "name" ? "text" : "text"}
                value={customerData[key as keyof typeof customerData]}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="border border-gray-300 p-2 mb-4 w-full"
              />
            ))}
            <div className="flex justify-around">
              <button
               className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleUpdateCustomer}
              >
                Mettre à jour
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
