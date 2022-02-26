export interface AccountData {
	name: {
		first: string
		last: string
	}
	email: string
	pets: {
		name: string
		colors: (string | undefined)[]
		rarity: string
		species: string
	}[],
	progress: {
		level: number,
		code: string,
		completed: boolean
	}[]
}
