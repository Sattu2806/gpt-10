import {v} from "convex/values"
import Together from "together-ai";
import { action, mutation, internalMutation, query, internalQuery } from "./_generated/server";
import { byEnumChat } from "./schema";

export const saveChat = internalMutation({
    args:{
        data:v.string(),
        by: byEnumChat,
        noteId:v.id('note')
    },
    handler: async(ctx, {data, by,noteId}) => {
        if(!data) return null
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(noteId)

        if(!existingNote){
            throw new Error('Note not found')
        }

        try {
            await ctx.db.insert('chats',{
                userId,
                data,
                by,
                noteId
            })
        } catch (error) {
            console.log("Error while saving the chats")
            return null
        }
    },
})

export const getAllChatsbyNote = internalQuery({
    args:{
        noteId: v.optional(v.id('note'))
    },
    handler: async(ctx, {noteId}) => {
        if(!noteId ) return

        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(noteId)

        if(!existingNote){
            throw new Error('Note not found')
        }

        try {
            const allChats = await ctx.db.query('chats')
            .withIndex("by_note", (q) => q.eq("noteId", existingNote._id))
            .collect()

            const paragraph = allChats.map(chat => chat.data).join('\n\n')

            return paragraph
        } catch (error) {
            console.log("Error finding all chats")
            return null
        }
    }
})

export const getChatByNoteIdClient = query({
    args:{
        noteId: v.optional(v.id('note'))
    },
    handler: async(ctx, {noteId}) => {

        if(!noteId ) return

        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }

        const userId = identity.subject

        const existingNote = await ctx.db.get(noteId)

        if(!existingNote){
            throw new Error('Note not found')
        }

        try {
            const allChats = await ctx.db.query('chats')
            .withIndex("by_note", (q) => q.eq("noteId", existingNote._id))
            .collect()

            return allChats
        } catch (error) {
            console.log("Error finding all chats")
            return null
        }
    }
})