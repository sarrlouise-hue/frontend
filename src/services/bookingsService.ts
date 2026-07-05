import { api, Booking } from "../lib/api";

export interface PriceCalculation {
	duration: number; // Jours ou Heures
	pricePerUnit: number;
	subtotal: number;
	discountPercentage: number;
	discountAmount: number;
	totalPrice: number;
}

export const bookingsService = {
	calculatePrice(
		data: {
			startDate?: string;
			endDate?: string;
			bookingDate?: string;
			startTime?: string;
			duration?: number;
			type: "daily" | "hourly";
		},
		pricePerDay: number,
		pricePerHour?: number
	): PriceCalculation {
		let finalPricePerUnit = 0;
		let finalDuration = 0;
		let subtotal = 0;
		let discountPercentage = 0;

		if (data.type === "daily" && data.startDate && data.endDate) {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			finalDuration =
				Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
				1;
			finalPricePerUnit = pricePerDay;
			subtotal = finalDuration * finalPricePerUnit;

			// Réductions dégressives par jour
			if (finalDuration >= 30) discountPercentage = 20;
			else if (finalDuration >= 14) discountPercentage = 15;
			else if (finalDuration >= 7) discountPercentage = 10;
		} else if (data.type === "hourly" && data.duration) {
			finalDuration = data.duration;
			finalPricePerUnit = pricePerHour || pricePerDay / 8;
			subtotal = finalDuration * finalPricePerUnit;
		}

		const discountAmount = (subtotal * discountPercentage) / 100;
		const totalPrice = subtotal - discountAmount;

		return {
			duration: finalDuration,
			pricePerUnit: finalPricePerUnit,
			subtotal,
			discountPercentage,
			discountAmount,
			totalPrice,
		};
	},

	async createBooking(bookingData: {
		serviceId: string;
		type: "daily" | "hourly";
		startDate?: string;
		endDate?: string;
		bookingDate?: string;
		startTime?: string;
		duration?: number;
		notes?: string;
	}): Promise<Booking> {
		try {
			const response = await api.post<{ success: boolean; data: Booking }>(
				"/bookings",
				bookingData
			);
			return response.data.data;
		} catch (error: any) {
			console.error("Error creating booking:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Erreur lors de la création de la réservation";
			throw new Error(errorMessage);
		}
	},

	async getMyBookings(): Promise<Booking[]> {
		try {
			const response = await api.get<{ data: Booking[] }>("/bookings");
			return response.data.data ?? [];
		} catch (error: unknown) {
			console.error("Error fetching user bookings:", error);
			throw new Error("Erreur lors de la récupération de vos réservations");
		}
	},

	async getReceivedBookings(): Promise<Booking[]> {
		try {
			const response = await api.get<{ data: Booking[] }>(
				"/providers/bookings"
			);
			return response.data.data ?? [];
		} catch (error: unknown) {
			console.error("Error fetching received bookings:", error);
			throw new Error("Erreur lors de la récupération des réservations reçues");
		}
	},

	async getBookingById(id: string): Promise<Booking | null> {
		try {
			const response = await api.get<{ data: Booking }>(`/bookings/${id}`);
			return response.data.data ?? null;
		} catch (error: unknown) {
			console.error("Error fetching booking:", error);
			throw new Error("Erreur lors de la récupération de la réservation");
		}
	},

	async cancelBooking(id: string): Promise<Booking> {
		try {
			const response = await api.put<{ data: Booking }>(
				`/bookings/${id}/cancel`
			);
			return response.data.data;
		} catch (error: unknown) {
			console.error("Error cancelling booking:", error);
			throw new Error("Erreur lors de l'annulation de la réservation");
		}
	},

	async confirmBooking(id: string): Promise<Booking> {
		try {
			const response = await api.put<{ data: Booking }>(
				`/bookings/${id}/confirm`
			);
			return response.data.data;
		} catch (error: unknown) {
			console.error("Error confirming booking:", error);
			throw new Error("Erreur lors de la confirmation de la réservation");
		}
	},

	async completeBooking(id: string): Promise<Booking> {
		try {
			const response = await api.put<{ data: Booking }>(
				`/bookings/${id}/complete`
			);
			return response.data.data;
		} catch (error: unknown) {
			console.error("Error completing booking:", error);
			throw new Error("Erreur lors de la finalisation de la réservation");
		}
	},
};
