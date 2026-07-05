import { api } from "../lib/api";

export interface Provider {
	id: string;
	userId: string;
	businessName: string;
	description?: string;
	phoneNumber: string;
	address?: string;
	city?: string;
	location?: string;
	status: string;
	rating?: number;
	reviewCount?: number;
	machineCount?: number;
	user?: {
		firstName: string;
		lastName: string;
		email: string;
		profileImage?: string;
	};
}

export const providerService = {
	getAllProviders: async (): Promise<Provider[]> => {
		const response = await api.get("/providers");
		return response.data;
	},

	getApprovedProviders: async (): Promise<Provider[]> => {
		const response = await api.get("/providers/approved");
		return response.data.data || response.data; // Handle potential wrapper
	},

	getProfileById: async (id: string): Promise<Provider> => {
		const response = await api.get(`/providers/${id}`);
		return response.data;
	},
};
