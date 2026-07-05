import React, { useState } from "react";
import { api } from "../../lib/api";

// Usage:
// <PayButton reservationId={reservation.id} canPay={canPay} phoneNumber={user.phoneNumber} />

interface PayButtonProps {
	reservationId: string;
	canPay: boolean;
	phoneNumber?: string;
}

const PayButton: React.FC<PayButtonProps> = ({
	reservationId,
	canPay,
	phoneNumber,
}) => {
	const [loading, setLoading] = useState(false);

	if (!canPay) return null;

	const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			// On utilise l'instance 'api' (axios) déjà configurée avec le token
			const response = await api.post("/payments/initiate", {
				bookingId: reservationId,
				phoneNumber: phoneNumber || "",
			});

			const data = response.data;

			// Extraction de l'URL de redirection (PayTech)
			const url =
				data?.data?.paytech?.payment_url ||
				data?.data?.redirect_url ||
				data?.redirect_url;

			if (url) {
				window.location.href = url;
				return;
			} else if (data?.data?.paytech?.simulated || data?.data?.simulated) {
				// Cas particulier pour le mode simulation (pas de URL)
				alert("Paiement simulé avec succès (Mode Dev)");
				window.location.reload();
				return;
			} else {
				throw new Error(
					data?.message || "Impossible d'obtenir l'URL de paiement"
				);
			}
		} catch (err: any) {
			console.error("Pay init failed", err);
			const errorMsg =
				err.response?.data?.message ||
				err.message ||
				"Erreur lors de l'initialisation du paiement.";

			alert(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handlePay}
			disabled={loading}
			className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
		>
			{loading ? (
				<div className="flex items-center justify-center space-x-2">
					<div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
					<span>Initialisation...</span>
				</div>
			) : (
				"Payer maintenant"
			)}
		</button>
	);
};

export default PayButton;
