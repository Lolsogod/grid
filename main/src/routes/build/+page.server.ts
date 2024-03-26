import { dictionary, grid } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return { 
        grid, 
        dictionary
     };
}) satisfies PageServerLoad;
