export interface ExerciseData {
	exercise: {
		number: number
		title: string
		objective: string
		markdown: string
		shellCode: string
		claimed: boolean
	},
	user: {
		pets: {
			name: string
			colors: (string | undefined)[]
			rarity: string
			species: string
		}[],
		preferredPet: number,
		progress: {
			level: number,
			code: string,
			completed: boolean
		}[]
	}
}
