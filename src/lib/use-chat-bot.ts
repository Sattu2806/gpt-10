import { useAction } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

const useChat = () => {
    const chat = useAction(api.message.chat)

    return async (text:string, noteId: Id<'note'>) => {
        const dochat = await chat({text, noteId})

        return dochat
    }
}

export default useChat