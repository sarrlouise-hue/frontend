import { api } from "../lib/api";

export const paymentService = {
	async checkStatus(bookingId: string) {
		try {
			const response = await api.get(`/payments/bookings/${bookingId}/status`);
			return response.data.data;
		} catch (error) {
			console.error("Error checking payment status:", error);
			throw error;
		}
	},

	async getPaymentByBookingId(bookingId: string) {
		try {
			const response = await api.get(`/payments/bookings/${bookingId}`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching payment:", error);
			throw error;
		}
	},
};
