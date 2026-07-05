import { api, Service } from "../lib/api";

export interface ServiceFilters {
	serviceType?: string;
	location?: string;
	minPrice?: number;
	maxPrice?: number;
	availability?: boolean;
	search?: string;
}

function transformServiceData(service: any): Service {
	// Adaptation simple des données reçues du backend PostgreSQL
	return {
		...service,
		id: service.id,
		pricePerDay: service.pricePerDay
			? parseFloat(service.pricePerDay as any)
			: undefined,
		pricePerHour: service.pricePerHour
			? parseFloat(service.pricePerHour as any)
			: undefined,
		images: Array.isArray(service.images) ? service.images : [],
		availability: !!service.availability,
	};
}

export const servicesService = {
	async getServices(filters?: ServiceFilters): Promise<Service[]> {
		try {
			const params = new URLSearchParams();

			if (filters?.serviceType)
				params.append("serviceType", filters.serviceType);
			if (filters?.minPrice)
				params.append("minPrice", filters.minPrice.toString());
			if (filters?.maxPrice)
				params.append("maxPrice", filters.maxPrice.toString());
			if (filters?.availability !== undefined)
				params.append("availability", filters.availability.toString());
			if (filters?.search) params.append("query", filters.search);

			const response = await api.get(`/services?${params.toString()}`);
			const services = response.data.data || [];
			return services.map(transformServiceData);
		} catch (error: any) {
			console.error("Error fetching services:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la récupération des services"
			);
		}
	},

	async getServiceById(id: string): Promise<Service | null> {
		try {
			const response = await api.get(`/services/${id}`);
			if (!response.data.data) return null;
			return transformServiceData(response.data.data);
		} catch (error: any) {
			console.error("Error fetching service:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la récupération du service"
			);
		}
	},

	async getMyServices(): Promise<Service[]> {
		try {
			const response = await api.get("/services/my-services");
			const services = response.data.data || [];
			return services.map(transformServiceData);
		} catch (error: any) {
			console.error("Error fetching user services:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la récupération de vos services"
			);
		}
	},

	async createService(serviceData: any): Promise<Service> {
		try {
			const response = await api.post("/services", serviceData);
			return response.data.data;
		} catch (error: any) {
			console.error("Error creating service:", error);
			throw new Error(
				error.response?.data?.message || "Erreur lors de la création du service"
			);
		}
	},

	async updateService(id: string, updates: any): Promise<Service> {
		try {
			const response = await api.put(`/services/${id}`, updates);
			return response.data.data;
		} catch (error: any) {
			console.error("Error updating service:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la mise à jour du service"
			);
		}
	},

	async deleteService(id: string): Promise<void> {
		try {
			await api.delete(`/services/${id}`);
		} catch (error: any) {
			console.error("Error deleting service:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la suppression du service"
			);
		}
	},

	async updateAvailability(
		serviceId: string,
		availability: boolean
	): Promise<void> {
		try {
			await api.put(`/services/${serviceId}/availability`, { availability });
		} catch (error: any) {
			console.error("Error updating availability:", error);
			throw new Error(
				error.response?.data?.message ||
					"Erreur lors de la mise à jour de la disponibilité"
			);
		}
	},

	async getCategories(): Promise<string[]> {
		// Cette info pourrait venir d'une constante ou d'un endpoint types
		return ["tractor", "semoir", "operator", "other"];
	},
};
