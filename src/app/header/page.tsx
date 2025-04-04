"use client" 

import { useTitleStore } from "@/lib/useTitleStore"

function Header() {

  const title = useTitleStore(state => state.title)

  return (
    <div className="bg-gray-900 text-white shadow-md h-20 top-0 z-50 flex items-center pl-10">
      {title}
    </div>
  )
}

export default Header

