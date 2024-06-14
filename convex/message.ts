import {v} from "convex/values"
import Together from "together-ai";
import { action, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY
})

export const chat = action({
    args:{
        text: v.string(),
        noteId: v.id('note')
    },
    handler: async (ctx, {text, noteId}) => {
        if(!text) return null

        await ctx.runMutation(internal.chat.saveChat,{
            by:'user',
            data:text,
            noteId
        })

        const allChats = await ctx.runQuery(internal.chat.getAllChatsbyNote,{noteId})

        let FinalText;

        if(!allChats){
            FinalText = text
        }else{
            FinalText = allChats + text
        }
        
        const response = await together.chat.completions.create({
            messages:[
                {
                    role:"system",
                    content:`You are a smart chat bot who give response to the quries.`
                },
                {
                    role:"user",
                    content: FinalText
                }
            ],
            model:"meta-llama/Llama-3-70b-chat-hf"
        })

        try {
            if(response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content){
                await ctx.runMutation(internal.chat.saveChat,{
                    by:"bot",
                    data:response.choices[0].message.content || "No content recieved",
                    noteId
                })
            }
        } catch (error) {
            
        }

        console.log(response)
    },
})

