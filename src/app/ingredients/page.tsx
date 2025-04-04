"use client";

import CreateIngredient from "@/components/createIngredients/page";
import { generatePath } from "@/lib/config";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type IngredientsType = {
  id: number;
  name: String;
};

function getIngredients() {
  const [ingredients, setIngredients] = useState<IngredientsType[]>([]);
  const[openModale, setOpenModale] = useState(false)
  const router = useRouter()

  useEffect(() => {
    void fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    const url = generatePath("/ingredients/all");
    const res = await fetch(url);
    if (!res.ok) {
      throw "fetch failed";
    }
    const data: IngredientsType[] = await res.json();
    setIngredients(data);
    console.log(data);
    
  };

  const handleOpenModale = () => {
    setOpenModale(!openModale);
    router.refresh()
  };

  return (
    <div className="container mx-auto mt-8 p-4 z-40">
      <div className="overflow-x-auto">
      <div>
        <button
          onClick={() => handleOpenModale()}
          className="bg-blue-500 p-2 rounded text-white cursor-pointer"
        >
          Ajouter l'unité
        </button>
      </div>
        <table className="min-w-full bg-gray-800 border border-gray-500 rounded-lg shadow-md">
          <thead >
            <tr>
              <th className="px-4 py-2 text-left">Nom de l'ingrédient</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="border-b last:border-b-0 hover:bg-gray-100"
              >
                <td className="px-4 py-2">{ingredient.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {openModale && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
            <CreateIngredient onCloseModale={handleOpenModale} />
          </div>
        </div>
      )}
      </div>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis
      deleniti, odio dignissimos accusantium tenetur quibusdam non temporibus
      sit nobis dolor tempore possimus modi? Temporibus nulla aperiam id libero
      suscipit totam? Dignissimos laudantium aut nihil perferendis nisi
      voluptatem esse perspiciatis culpa saepe iste modi sint explicabo quas
      ducimus fuga, praesentium nam ab voluptas officia adipisci cum hic! Quasi,
      accusantium consectetur. Illo? In nemo amet laborum non modi porro quos
      nesciunt veniam voluptates voluptas ab, eius, mollitia, necessitatibus
      velit nostrum. In numquam quo, et earum fuga iusto consequatur veniam
      minus provident dignissimos. Doloremque laudantium, voluptatum sunt labore
      porro eius explicabo, non error, hic optio illo quam aperiam quibusdam
      distinctio ex inventore voluptas delectus vero id accusamus fugiat
      mollitia. Accusantium odit alias dignissimos! Harum vero et tempora?
      Debitis quidem laboriosam, quos corrupti amet harum. Reprehenderit,
      adipisci illo sint doloribus, id rem ullam velit voluptate dolorem
      assumenda ipsa tenetur consectetur unde tempore quae a. Et ea porro
      sapiente amet, rerum exercitationem minus similique asperiores sed debitis
      maxime iste dignissimos expedita mollitia cum temporibus est ut. Similique
      suscipit quae optio quasi! Doloremque dolores dolor officia. Labore
      veritatis neque vero illo sit a ipsum omnis voluptate maxime ab, deserunt
      cupiditate ea aperiam excepturi optio saepe at dignissimos pariatur velit,
      porro, asperiores enim. Provident vel minima magni. Illum nemo, culpa
      vitae placeat, alias quisquam esse velit fuga sint eligendi odio atque vel
      sit labore iste dolore. Nulla doloremque nesciunt pariatur repellat libero
      placeat eos natus ad odio. Eos numquam, debitis nesciunt, ratione vitae
      nemo itaque cum culpa doloribus quia praesentium veritatis aliquam
      reprehenderit quaerat modi! Amet sit distinctio doloremque sint illum
      soluta corrupti mollitia, est tempora quo. Consequuntur doloribus sequi
      eaque numquam rerum porro unde commodi accusantium excepturi aut eveniet,
      libero quibusdam atque? Molestias aperiam laboriosam nisi, eos maxime quas
      iusto voluptate, quam tenetur officiis voluptates vitae? Natus architecto
      corporis, ut saepe a ipsum odio illum eos sit explicabo placeat eligendi
      eum ex vitae. Laboriosam iure amet ea doloribus rerum ipsam ducimus ab
      necessitatibus ipsum? Facere, commodi? Voluptate exercitationem
      repudiandae, distinctio perferendis quibusdam ipsum aperiam explicabo
      veritatis doloremque mollitia corrupti cumque earum officia quis. Enim
      libero inventore, eligendi sed perspiciatis, commodi adipisci error odit
      non, eos vero. Eius hic exercitationem facere ullam, ab laborum modi
      veniam ducimus praesentium saepe, earum suscipit cupiditate vel expedita
      unde perspiciatis velit eos laboriosam nam? Alias mollitia error sapiente
      adipisci explicabo officiis. Perspiciatis rerum illo officia ea explicabo.
      Perferendis magni ducimus maiores quidem, necessitatibus quod ea error,
      iure, laborum deleniti ratione! Nisi minus quam nulla iusto quas ex odio
      dolor possimus facilis! Blanditiis nulla dolor quis voluptate ad quod
      labore iste quaerat voluptatibus nisi! Cupiditate dolores ex vitae
      corrupti quae aperiam a eaque omnis consequuntur tempora soluta
      consequatur, qui, quia minima doloribus! Ullam omnis laborum praesentium
      nesciunt, eligendi voluptatum voluptas nostrum consectetur sunt laudantium
      modi nulla ducimus molestiae itaque explicabo debitis at nihil amet ad
      aliquid! Fuga laudantium officia ratione quibusdam magnam? Cum eum
      impedit, fuga minus necessitatibus laborum delectus, assumenda nam ipsum,
      ut eius temporibus at? Cumque omnis totam minima officiis. Nihil maxime
      est, fugiat dolore exercitationem atque facere eius autem. Ipsa velit
      magni minus inventore distinctio amet earum quam nemo, iure laudantium
      autem aliquam vero quas, ex quasi similique rem tempora ullam consequatur
      libero, voluptatem impedit doloremque? Sed, excepturi saepe! Repudiandae
      rerum, dolorum animi quasi hic ipsum minus rem sapiente, aut, porro natus?
      Delectus adipisci excepturi fugit eius? Ab aliquam natus placeat eligendi!
      Quasi necessitatibus ad culpa. In, sed quis? Dignissimos praesentium
      numquam reprehenderit culpa quaerat? Eum nemo molestias mollitia
      laboriosam sunt, eveniet dignissimos minus ullam autem, sapiente odit
      nesciunt labore animi, quia voluptatibus consequuntur ut deleniti at earum
      quas.
    </div>
  );
}

export default getIngredients;
