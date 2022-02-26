export interface AccountData {
	name: {
		first: string
		last: string
	}
	email: string
	pets: {
		name: string
		color: string
		species: string
	},
	progress: {
		level: number,
		code: string,
		completed: boolean
	}[]
}
