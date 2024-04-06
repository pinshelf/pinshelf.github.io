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

////////////////////////////////////////////////////////////////////////////////
