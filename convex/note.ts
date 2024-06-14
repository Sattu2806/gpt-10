import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createNote = mutation({
    args:{
        title: v.string()
    },
    handler : async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }
        
        const word = args.title.split(" ")

        const limitedText = word.length > 0 ? word.slice(0.10).join(' '): args.title

        const userId = identity.subject

        const noteId = await ctx.db.insert('note',{
            title: limitedText,
            userId,
        })

        return noteId
    },
})

export const deleteNote = mutation ({
    args:{
        noteId: v.id('note')
    },
    handler : async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }
        
        const note = await ctx.db.delete(args.noteId)
    }
})


export const AllNotes = query({
    args:{
        
    },
    handler : async (ctx) => {
        console.log("server identity", await ctx.auth.getUserIdentity());
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error('Unathenticated')
        }

        const userId = identity.subject

        const notes = await ctx.db.query('note')
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect()

        return notes
    }
})