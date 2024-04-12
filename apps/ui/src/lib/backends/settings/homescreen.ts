// Imports /////////////////////////////////////////////////////////////////////
import { z } from 'zod'

// Schema //////////////////////////////////////////////////////////////////////

/**
 * App
 */
const AppSchema = z.object({
    type        : z.literal('app'),
    id          : z.string(), // UUID
    bookmarkId  : z.number(),

    overwrites  : z.object({
        title   : z.string().optional(),
        iconUrl : z.string().optional(),
    }).optional(),
})

export type App = z.infer<typeof AppSchema>

/**
 * Divider
 */
const DividerSchema = z.object({
    type        : z.literal('divider'),
    id          : z.string(), // UUID
    title       : z.string(),
})

export type Divider = z.infer<typeof DividerSchema>

/**
 * Control Schema
 */
const ControlSchema = z.object({
    type        : z.literal('control'),
    id          : z.string(), // UUID
    action      : z.literal('add'), // extend with z.union([ z.literal(...), ])
})

export type Control = z.infer<typeof DividerSchema>

/**
 * Page Schema
 */
export const PageSchema = z.object({
    title       : z.string(),
    grid        : z.discriminatedUnion('type', [
        AppSchema, DividerSchema, ControlSchema
    ]).array(),
})

export type Page = z.infer<typeof PageSchema>


////////////////////////////////////////////////////////////////////////////////
