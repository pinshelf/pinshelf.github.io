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
    id: string,         // uuid
    bookmarkId: number  // nuber as in IBookmark!

    overwrites?: {
        title?  : string | undefined,
        iconUrl?: string | undefined
    }
}

export interface AppGroup {
    apps: App[]
}

export interface Divider {
    id: string // uuid
    title: string,
}

export interface Page {
    title: string,
    grid: (AppGroup | Divider)[]
}

export function homescreenItemType(
    item: AppGroup | Divider
): 'appGroup' | 'divider' {
    if ((item as AppGroup).apps) { return 'appGroup' }
    else { return 'divider' }
}

////////////////////////////////////////////////////////////////////////////////
