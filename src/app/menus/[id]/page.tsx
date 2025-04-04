import React from 'react'

type Props = {
  params:{id: string}
}

function MenuPegeId({params}: Props) {
  return (
    <div>MenuPegeId {params.id}</div>
  )
}

export default MenuPegeId