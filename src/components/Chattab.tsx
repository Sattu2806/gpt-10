'use client'
import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import ChatMessages from './ChatMessages'
import { Id } from '../../convex/_generated/dataModel'
import useChat from '@/lib/use-chat-bot'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useRouter } from 'next/navigation'
type Props = {
    noteId?:string
}

function Chattab({noteId}: Props) {
    const [waitingresponse, setwaitingResponse] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const chat = useChat()
    const create = useMutation(api.note.createNote)
    const router = useRouter()


    const AskBot = async () => {
        if(!input.trim()){
            return
        }
        if(!noteId){
            setwaitingResponse(true)
            const noteId = await create({title:input})
            await chat(input,noteId)
            setwaitingResponse(false)
            router.push(`/chat/${noteId}`)
        }else{
            setwaitingResponse(true)
            await chat(input,noteId as Id<'note'>)
            setwaitingResponse(false)
        }
    }

    const handleKeydown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && !e.shiftKey && !e.ctrlKey){
            e.preventDefault()
            AskBot()
            setInput('')
        }else if((e.key === 'Enter' && e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)){
            e.preventDefault()
            setInput(input + '\n')
        }
    }

  return (
    <div className='p-2 flex flex-col justify-between h-screen'>
        <div className='flex-grow overflow-auto max-w-screen-lg mx-auto w-full'>
            <ChatMessages waitingresponse={waitingresponse} noteId={noteId as Id<'note'>} />
        </div>
        <div className='flex items-center space-x-3 sticky bottom-0 p-3 max-w-screen-lg mx-auto w-full'>
            <div className={`focus:outline w-full border-[1px] rounded-3xl border-neutral-700 flex items-center spa2 px-3 bg-background ${waitingresponse ? "pointer-events-none":""} `}>
                <Textarea
                value={input}
                disabled={waitingresponse}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeydown}
                placeholder='Message GPT-10'
                className='flex-grow rounded-3xl border-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 bg-transparent'
                />
            </div>
            <Button
             size='lg'
             disabled={waitingresponse} 
             onClick={() => {AskBot(); setInput('')}}
             className='rounded-full p-2 w-9 h-9 aspect-square flex items-center text-slate-100'>
                <Send className='size-5' strokeWidth={2}/>
            </Button>
        </div>
    </div>
  )
}

export default Chattab