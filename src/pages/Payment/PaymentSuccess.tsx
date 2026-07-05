import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { reservationsService } from "../../services/reservationsService";
import { bookingsService } from "../../services/bookingsService";

import { CheckCircle, Loader } from "lucide-react";

export const PaymentSuccess: React.FC = () => {
	const { user, loading: authLoading } = useAuth();
	const { navigate } = useRouter();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (authLoading) return;

		if (!user) {
			navigate("/login");
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const reservationId = params.get("reservation");
		const bookingId = params.get("booking");

		if (bookingId) {
			loadBooking(bookingId);
		} else if (reservationId) {
			loadReservation(reservationId);
		} else {
			navigate("/dashboard");
		}
	}, [user, authLoading]);

	const loadBooking = async (id: string) => {
		try {
			// Forcer la vérification du statut côté serveur avec PayTech
			const { paymentService } = await import("../../services/paymentService");
			await paymentService.checkStatus(id);

			// Re-charger les données après le check
			const booking = await bookingsService.getBookingById(id);
			if (!booking) {
				navigate("/dashboard");
				return;
			}
			setData(booking);
		} catch (error) {
			console.error("Error loading/verifying booking:", error);
			// Fallback: load anyway
			const booking = await bookingsService.getBookingById(id);
			if (booking) setData(booking);
		} finally {
			setLoading(false);
		}
	};

	const loadReservation = async (id: string) => {
		try {
			const res = await reservationsService.getReservationById(id);
			if (!res) {
				navigate("/dashboard");
				return;
			}
			setData(res);
			// Update payment status if it was a machine reservation
			try {
				await reservationsService.updatePaymentStatus(id, "paid", "paytech");
				await reservationsService.updateReservationStatus(id, "confirmed");
			} catch (e) {
				console.error("Error updating machine reservation status:", e);
			}
		} catch (error) {
			console.error("Error loading reservation:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading || authLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="flex flex-col items-center">
					<Loader className="w-12 h-12 text-green-600 animate-spin mb-4" />
					<p className="text-gray-600 font-medium">
						Chargement de vos détails de paiement...
					</p>
				</div>
			</div>
		);
	}

	const getAmount = () => {
		return data?.totalPrice || data?.total_price || 0;
	};

	const getServiceName = () => {
		return (
			data?.service?.name ||
			data?.machine?.name ||
			data?.serviceId ||
			data?.machine_id ||
			"Service"
		);
	};

	const getReference = () => {
		return data?.id || data?._id || "";
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="container mx-auto px-4 max-w-2xl">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
					<div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-10 text-center relative">
						<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
							<CheckCircle className="w-64 h-64 -ml-20 -mt-20 transform -rotate-12" />
						</div>
						<div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg transform scale-110">
							<CheckCircle className="w-14 h-14 text-green-600" />
						</div>
						<h1 className="text-4xl font-extrabold mb-3 tracking-tight">
							Paiement réussi !
						</h1>
						<p className="text-green-50 text-lg opacity-90">
							Votre réservation est désormais confirmée
						</p>
					</div>

					<div className="p-8 space-y-8">
						<div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
							<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Détails de la transaction
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center text-lg">
									<span className="text-gray-600">Service</span>
									<span className="font-bold text-gray-900">
										{getServiceName()}
									</span>
								</div>
								<div className="flex justify-between items-center text-lg">
									<span className="text-gray-600">Montant payé</span>
									<span className="font-extrabold text-green-600 text-2xl">
										{getAmount().toLocaleString()} FCFA
									</span>
								</div>
								<div className="flex justify-between items-center text-lg">
									<span className="text-gray-600">Statut Paiement</span>
									<span
										className={`font-bold px-3 py-1 rounded-full text-sm ${
											data?.payment?.status === "success" ||
											data?.paymentStatus === "paid"
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{data?.payment?.status === "success" ||
										data?.paymentStatus === "paid"
											? "Confirmé"
											: "En attente"}
									</span>
								</div>

								<div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
									<div className="flex justify-between items-center">
										<span className="text-gray-500">Référence Réservation</span>
										<span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
											{getReference()}
										</span>
									</div>
									{data?.payment?.transactionId && (
										<div className="flex justify-between items-center">
											<span className="text-gray-500">ID Transaction</span>
											<span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
												{data.payment.transactionId}
											</span>
										</div>
									)}
									<div className="flex justify-between items-center text-xs text-gray-400 mt-2 italic">
										* Utilisez l'ID Transaction pour vos recherches dans la base
										de données de paiement.
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-col space-y-4 pt-4">
							<Link
								to="/dashboard"
								className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-bold text-center block"
							>
								Accéder à mon tableau de bord
							</Link>
							<Link
								to="/services"
								className="w-full bg-white text-green-600 py-4 rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all font-bold text-center block"
							>
								Explorer d'autres services
							</Link>
						</div>
					</div>

					<div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
						<p className="text-xs text-gray-400">
							Un email de confirmation vous a été envoyé. Si vous avez des
							questions, contactez notre support.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
