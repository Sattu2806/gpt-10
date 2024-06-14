//schema.ts

import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values"

export const byEnumChat = v.union(v.literal("user"), v.literal("bot"))


export default defineSchema({
    note:defineTable({
        title:v.string(),
        userId:v.string()
    }).index("by_user",["userId"]),
    chats:defineTable({
        noteId: v.id("note"),
        data:v.string(),
        userId:v.string(),
        by: byEnumChat
    }).index("by_note", ["noteId"])
    .index("by_user",["userId"])
})