import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { generatePath } from "@/lib/config";

type PropsType = { 
    operationId: number
     onClose: () => void
    }


type OperationDetail = {
  ingredienId: number;
  ingredientName: string;
  operations: any[]
}

const OperationStockDetails = ({ operationId, onClose }: PropsType) => {
  const [operationDetails, setOperationDetails] = useState<null | OperationDetail>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const url = `${generatePath("/operations/details/")}${operationId}`;
    fetch(url)
      .then((res) => {
        const json = res.json()
        return json as Promise<OperationDetail>
      })
      .then(data =>  {
        console.log(data);
        
        setOperationDetails(data);
        setError(null);
      } )
      .catch((error: any) => {
        console.error(error);
        setError("Erreur lors de la récupération des détails de l'opération.");
      });
  }, [operationId]);

  if (!operationDetails) {
    return <div>Chargement des détails...</div>;
  }

  return (
    <div className="p-8">
      {error && (
        <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {!error && (
        <>
          <p>
            <strong>Nom de l&apos;Ingrédient:</strong>{" "}
            {operationDetails.ingredientName}
          </p>
          <h3 className="text-md font-semibold mt-4">
            Liste des opérations résumées :
          </h3>
          <ul
            className="h-[300px] overflow-y-auto scrollbar-custom border border-collapse p-4"
            onMouseEnter={() => setShowScrollbar(true)}
            onMouseLeave={() => setShowScrollbar(false)}
            style={{
              scrollbarWidth: showScrollbar ? "thin" : "none",
              overflowY: showScrollbar ? "scroll" : "hidden",
            }}
          >
            {operationDetails.operations
              .toSorted((a, b) => b.id - a.id)
              .map((op) => (
                <li key={op.id} className="border-b border-gray-300 py-2">
                  <p>
                    <strong>Type:</strong> {op.type}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {dayjs(op.date).format("YYYY-MM-DD HH:mm")}
                  </p>
                  <p>
                    <strong>Description:</strong> {op.description}
                  </p>
                </li>
              ))}
          </ul>
        </>
      )}
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Fermer
      </button>
      <style jsx="true">{`
        body {
          overflow-y: hidden; /* Masquer la barre de défilement sur le corps */
        }
        .Sidebar::-webkit-scrollbar {
          width: ${showScrollbar
            ? "8px"
            : "0px"}; /* Largeur de la barre de défilement */
        }
        .Sidebar::-webkit-scrollbar-thumb {
          background-color: gray; /* Couleur de la barre de défilement */
          border-radius: 10px; /* Coins arrondis */
        }
      `}</style>
    </div>
  );
}

export default OperationStockDetails;
