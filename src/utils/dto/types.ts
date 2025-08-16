export type GetMeasureResponse = {
	id: number;
	value: number;
	dtMeasure: string;
	sensor: {
		id: number;
		name: string;
		unit: string;
	};
	container: {
		id: number;
		name: string;
		weight: number;
		valid: boolean;
	};
};

export type LoginResponse = {
	user: {
		id: string;
		username: string;
	};
	accessToken: string;
	refreshToken: string;
};
