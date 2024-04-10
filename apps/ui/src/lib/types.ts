// Imports /////////////////////////////////////////////////////////////////////
import { z } from 'zod'

// Types ///////////////////////////////////////////////////////////////////////

/**
 * Backend variants (array & union type).
 */
export const BACKENDS = ['xbs', 'raindrop'] as const;
export type Backend = (typeof BACKENDS)[number];
export const BackendSchema = z.enum(BACKENDS);


/**
 * Profile
 */
export const ProfileSchema = z.object({
    name        : z.string(),
    backend     : BackendSchema,
    credentials : z.record(z.string(), z.unknown()),
});

export type Profile = z.infer<typeof ProfileSchema>;


/**
 * Homescreen
 */
export type Homescreen = Page[];

export interface App {
    type: 'app',
    id: string,         // uuid
    bookmarkId: number  // nuber as in IBookmark!

    overwrites?: {
        title?  : string | undefined,
        iconUrl?: string | undefined
    }
}

export interface Control {
    type: 'control',
    action: 'add',
}

export interface Divider {
    type: 'divider',
    id: string // uuid
    title: string,
}

export interface Page {
    title: string,
    grid: (App | Divider | Control)[]
}

////////////////////////////////////////////////////////////////////////////////
