export interface ExerciseData {
	exercise: {
		number: number
		title: string
		objective: string
		markdown: string
		shellCode: string
	},
	user: {
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
}
