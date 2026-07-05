import { api } from "../lib/api";

export interface PayTechPaymentResponse {
	success: boolean;
	token: string;
	redirect_url: string;
	error?: string;
}

export const paytechService = {
	async initiatePayment(paymentData: {
		bookingId: string;
		amount: number;
		phoneNumber: string;
		description: string;
		successUrl?: string;
		cancelUrl?: string;
	}): Promise<PayTechPaymentResponse> {
		try {
			const baseUrl = window.location.origin;
			const requestData = {
				bookingId: paymentData.bookingId,
				amount: paymentData.amount,
				phoneNumber: paymentData.phoneNumber,
				description: paymentData.description,
				successUrl:
					paymentData.successUrl ||
					`${baseUrl}/payment-success?booking=${paymentData.bookingId}`,
				cancelUrl:
					paymentData.cancelUrl ||
					`${baseUrl}/payment-cancel?booking=${paymentData.bookingId}`,
			};

			const response = await api.post("/payments/initiate", requestData);

			if (response.data.success) {
				const { paytech } = response.data.data;
				return {
					success: true,
					token: paytech.token,
					redirect_url: paytech.payment_url,
				};
			} else {
				throw new Error(response.data.message || "Payment initiation failed");
			}
		} catch (error: any) {
			console.error("Error initiating PayTech payment:", error);
			return {
				success: false,
				token: "",
				redirect_url: "",
				error:
					error.response?.data?.message ||
					error.message ||
					"Failed to initiate payment",
			};
		}
	},

	async verifyPayment(token: string): Promise<{
		success: boolean;
		status: string;
		transaction_id?: string;
		error?: string;
	}> {
		try {
			const response = await api.post("/payments/verify", { token });

			return {
				success: response.data.success,
				status: response.data.data.status,
				transaction_id: response.data.data.transactionId,
			};
		} catch (error: any) {
			console.error("Error verifying payment:", error);
			return {
				success: false,
				status: "error",
				error: error.response?.data?.message || "Failed to verify payment",
			};
		}
	},

	formatAmount(amount: number): number {
		return Math.round(amount);
	},

	getPaymentUrl(token: string): string {
		return `https://paytech.sn/payment/checkout/${token}`;
	},

	async handleIPN(_ipnData: any): Promise<boolean> {
		console.warn("IPN handling is done on the backend");
		return false;
	},

	convertToXOF(amount: number, fromCurrency: string = "XOF"): number {
		if (fromCurrency === "XOF") {
			return amount;
		}
		return amount;
	},
};
