import Chattab from '@/components/Chattab'
import React from 'react'

type Props = {}

function page({params}:{params:{chat:string}}) {
  return (
    <div>
        <Chattab noteId={params.chat}/>
    </div>
  )
}

export default page