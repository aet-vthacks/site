export interface ExercisesData {
	data: {
		number: number
		title: string
		objective: string
		markdown: string
		shellCode: string
		claimed: boolean
	}[],
	user: {
		pets: {
			name: string
			colors: (string | undefined)[]
			rarity: string
			species: string
		}[],
		progress: {
			exerciseUUID: number,
			claimed: boolean
			code: string,
			completed: boolean
		}[]
	}
}
