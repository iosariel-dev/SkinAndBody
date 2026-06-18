export interface Specialist {
	photo: string;
	name: string;
	direction: string;
	description: string;
	tags?: string[];
	photoPosition?: string;
	photoScale?: number;
}

export interface SpecialistsData {
	[locationKey: string]: Specialist[];
}
