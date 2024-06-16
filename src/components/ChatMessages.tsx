import React, { useEffect, useRef } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { Spinner } from './Spinner'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ReactMarkdown from "react-markdown"
import {format} from "date-fns"

type Props = {
  waitingresponse:boolean,
  noteId?:Id<'note'>
}

function ChatMessages({waitingresponse, noteId}: Props) {
  const allChats = useQuery(api.chat.getChatByNoteIdClient,{noteId}) || []

  const messageRef = useRef<HTMLDivElement>(null)

  const scrollBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth', block:'nearest', inline:'start' })
  }

  useEffect(() => {
    if(allChats.length > 0){
      scrollBottom()
    }
  },[allChats])

  return (
    <div className={`p-4 flex flex-col space-y-4`}>
      {allChats.map((chat, index) => (
        <div 
        key={index}
        className={`p-4 max-w-[90%]
          ${chat.by === 'user' ? 
            "bg-secondary text-neutral-800 dark:text-neutral-400 self-start rounded-tl-3xl rounded-tr-3xl rounded-br-3xl"
            : "bg-primary-foreground text-blue-950  dark:text-neutral-200 self-end rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl"
          }
        `}
        >
          <ReactMarkdown>{chat.data}</ReactMarkdown>
          <small className={`self-end mt-2 flex items-center ${chat.by === 'user' ? "text-slate-400 justify-end":"text-neutral-500 justify-start"}`}>
            {format(new Date(chat._creationTime), 'PPpp')}
          </small>
        </div>
      ))}
      {waitingresponse && (
        <div className={`p-4 max-w-[90%] bg-primary-foreground text-black self-end rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl transition-all duration-300 ease-in-out`}>
          <Spinner/>
        </div>
      )}
      <div ref={messageRef} />
    </div>
  )
}

export default ChatMessages