export interface CodeData {
	data: [
		{
			status: boolean,
			values: { name: string, value: string }[],
			raw: SuccessfulRaw | FailedRaw
		}
	]
}

export type SuccessfulRaw = {
	success: boolean,
	returns: string,
	variables: [string, string]
	stdout: string
}

export type FailedRaw = {
	success: boolean,
	error: string,
	message: string,
	trace: string
}
