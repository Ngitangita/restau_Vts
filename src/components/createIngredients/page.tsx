import { generatePath } from "@/lib/config";
import { useEffect, useState } from "react";

type UniteType = {
  id: number;
  name: string;
};

const CreateIngredient =({onCloseModale}: {onCloseModale: ()=>void}) =>{
const[ingredient, setIngredient] = useState({
    name: "",
    unitId: "",
    groupId: ""
})

const [units, setUnits] = useState<UniteType[]>([]);
const [ingredientGroups, setIngredientGroups] = useState<UniteType[]>([]);

const postIngredient = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const url = generatePath("/ingredients")
    
    const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: ingredient.name, 
          unitId: parseInt(ingredient.unitId, 10), 
          groupId: parseInt(ingredient.groupId, 10) })
    })
    const data = await res.json()
}

const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const{name, value} = e.target;
    setIngredient((i) => ({...i, [name]:value}))
}

const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
  const{name, value} = e.target;
  setIngredient((i) => ({...i, [name]:value}))
}

useEffect(() =>{
  void fetchUnite();
  void fetchIngredientGroups();
}, [])

const fetchUnite = async() =>{
  const url = generatePath("/units/all")
 try {
  const res = await fetch(url)
  if (!res.ok) {
    throw("erreur")
  }
  const data: UniteType[] = await res.json()
  
  setUnits(data)
 } catch (error) {
  throw("units")
 }
}

const fetchIngredientGroups = async() => {
  const url = generatePath("/ingredients/groups")
  try {
    const res = await fetch(url)
  if (!res.ok) {
    throw("fetch ingredient failed")
  }
  const data: UniteType[] = await res.json()
  setIngredientGroups(data)
  } catch (error) {
    throw( "ingredient")
  }
}

  return (
    <div className="max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold pl-6">Ajouter une ingredient</h2>
        <span
          className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
           relative text-[30px] hover:text-white cursor-pointer"
           onClick={onCloseModale}
        >
          x
        </span>
      </div>
      <form className="p-6" onSubmit={postIngredient}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-start"
          >
            Nom de l'ingredient
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={ingredient.name}
            onChange={onChangeInput}
            className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm
             focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de l'unité"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="ingredientid"
            className="block text-sm font-medium text-start"
          >
            Nom de l'ingredient
          </label>
          <select name="ingredientid" id="ingredientid"
         className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm
           focus:ring-blue-500 focus:border-blue-500"
           value={ingredient.groupId}
           onChange={onChangeSelect}>
            <option value=""className="bg-gray-500">Séléctionez ingredient</option>
            {ingredientGroups.map(ingredientGroup =>(
              <option key={ingredientGroup.id} value={ingredientGroup.id}
              className="bg-gray-500">
                {ingredientGroup.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="unitId"
            className="block text-sm font-medium text-start"
          >
            Nom de l'unité
          </label>
          <select name="unitId" id="unitId"
          className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm
           focus:ring-blue-500 focus:border-blue-500"
           value={ingredient.unitId}
           onChange={onChangeSelect}>
            <option value=""className="bg-gray-500">Sélectionnez des unité</option>
              {units.map(unit =>(
                <option key={unit.id} value={unit.id}
                className="bg-gray-500">
                  {unit.name}</option>
              ))}
          </select>
        </div>
        <div className="flex flex-row gap-10 w-full justify-between">
          <button
          onClick={onCloseModale}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer"
          >
            Annuller
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            cursor-pointer"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateIngredient;