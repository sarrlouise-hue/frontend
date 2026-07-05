import React, { useEffect, useState } from "react";
import { useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { reservationsService } from "../../services/reservationsService";
import { paytechService } from "../../services/paytechService";
import { Reservation } from "../../types";
import { CreditCard, Loader, AlertCircle, CheckCircle } from "lucide-react";

export const Payment: React.FC = () => {
	const { user } = useAuth();
	const { navigate, currentPath } = useRouter();
	const [reservation, setReservation] = useState<Reservation | null>(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const reservationId = new URLSearchParams(currentPath.split("?")[1]).get(
			"reservation"
		);
		if (!reservationId) {
			navigate("/dashboard");
			return;
		}

		loadReservation(reservationId);
	}, [user, currentPath]);

	const loadReservation = async (reservationId: string) => {
		try {
			const data = await reservationsService.getReservationById(reservationId);
			if (!data) {
				setError("Réservation introuvable");
				return;
			}

			if (data.user_id !== user!.id) {
				setError("Vous n'êtes pas autorisé à accéder à cette réservation");
				return;
			}

			if (data.payment_status === "paid") {
				navigate(`/payment-success?reservation=${reservationId}`);
				return;
			}

			setReservation(data);
		} catch (err: any) {
			setError(err.message || "Erreur lors du chargement de la réservation");
		} finally {
			setLoading(false);
		}
	};

	const handlePayment = async () => {
		if (!reservation) return;

		setProcessing(true);
		setError("");

		try {
			const result = await paytechService.initiatePayment({
				bookingId: reservation.id,
				amount: reservation.total_price,
				phoneNumber: user?.phoneNumber || "+221700000000",
				description: `Location ${reservation.machine?.name || "Machine"} - ${
					reservation.total_days
				} jours`,
				successUrl: `${window.location.origin}/payment-success?booking=${reservation.id}`,
				cancelUrl: `${window.location.origin}/payment-cancel?booking=${reservation.id}`,
			});

			if (result.success && result.redirect_url) {
				window.location.href = result.redirect_url;
			} else {
				setError(result.error || "Erreur lors de l'initiation du paiement");
				setProcessing(false);
			}
		} catch (err: any) {
			setError(err.message || "Erreur lors du paiement");
			setProcessing(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	if (error && !reservation) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
					<AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<button
						onClick={() => navigate("/dashboard")}
						className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
					>
						Retour au tableau de bord
					</button>
				</div>
			</div>
		);
	}

	if (!reservation) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-2xl">
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-green-600 text-white p-6">
						<div className="flex items-center space-x-3 mb-2">
							<CreditCard className="w-8 h-8" />
							<h1 className="text-2xl font-bold">Paiement</h1>
						</div>
						<p className="text-green-100">
							Finalisez votre réservation en effectuant le paiement
						</p>
					</div>

					<div className="p-6">
						{error && (
							<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
								<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
								<p className="text-red-800 text-sm">{error}</p>
							</div>
						)}

						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Récapitulatif
							</h2>
							<div className="bg-gray-50 rounded-lg p-4 space-y-3">
								<div>
									<div className="text-sm text-gray-600 mb-1">Machine</div>
									<div className="font-semibold text-gray-900">
										{reservation.machine?.name || "Machine"}
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<div className="text-sm text-gray-600 mb-1">
											Date de début
										</div>
										<div className="font-medium text-gray-900">
											{new Date(reservation.start_date).toLocaleDateString(
												"fr-FR"
											)}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-600 mb-1">
											Date de fin
										</div>
										<div className="font-medium text-gray-900">
											{new Date(reservation.end_date).toLocaleDateString(
												"fr-FR"
											)}
										</div>
									</div>
								</div>
								<div className="border-t border-gray-200 pt-3 space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Durée</span>
										<span className="font-medium">
											{reservation.total_days} jour
											{reservation.total_days > 1 ? "s" : ""}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Prix par jour</span>
										<span className="font-medium">
											{reservation.price_per_day.toLocaleString()} FCFA
										</span>
									</div>
									<div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
										<span>Total à payer</span>
										<span className="text-green-600">
											{reservation.total_price.toLocaleString()} FCFA
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={() => navigate("/dashboard")}
								disabled={processing}
								className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
							>
								Annuler
							</button>
							<button
								onClick={handlePayment}
								disabled={processing}
								className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
							>
								{processing ? (
									<>
										<Loader className="w-5 h-5 animate-spin" />
										<span>Redirection...</span>
									</>
								) : (
									<>
										<CreditCard className="w-5 h-5" />
										<span>
											Payer {reservation.total_price.toLocaleString()} FCFA
										</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
