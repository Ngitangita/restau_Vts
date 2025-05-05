import { convertStatusMenu } from "@/lib/convertStatus";

type StatusType = {
  status: string;
  statuses: string[];
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => void;
  onCancel: () => void;
};

const UpdateStatusMenu = ({
  status,
  statuses,
  setStatus,
  onSave,
  onCancel,
}: StatusType) => {
  return (
    <div className="p-6 z-[100]">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border outline-none focus:border-blue-500 p-2 rounded-md w-full mb-4"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {convertStatusMenu(status.toLowerCase())}
          </option>
        ))}
      </select>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2 cursor-pointer"
          onClick={onSave}
        >
          Sauvegarder
        </button>
        <button
           className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default UpdateStatusMenu;
