import React, { useEffect, useState } from "react";
import PayButton from "../../Common/PayButton.tsx";

import { api } from "../../../lib/api";
import {
	Calendar,
	Activity,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Star,
	MessageCircle,
} from "lucide-react";

interface ServiceBooking {
	id: string;
	service: any;
	user?: {
		id: string;
		firstName: string;
		lastName: string;
		phoneNumber?: string;
		email: string;
	};
	type: string;
	startDate: string;
	endDate: string;
	bookingDate?: string;
	startTime?: string;
	status: string;
	totalPrice: number;
	duration: number;
	paymentStatus?: string;
	notes?: string;
	createdAt: string;
}

export const ProducteurManageReservations: React.FC = () => {
	const [bookings, setBookings] = useState<ServiceBooking[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<string>("all");

	const firstImageUrl = (images: any) => {
		if (!images) return "";
		if (Array.isArray(images)) {
			const val = images[0];
			if (!val) return "";
			if (typeof val === "string") return val;
			return (
				val.url || val.path || val.secure_url || val.publicUrl || val.src || ""
			);
		}
		if (typeof images === "string") return images;
		return "";
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			const response = await api.get("/bookings");
			// The backend returns an array in response.data.data
			setBookings(response.data.data || response.data.bookings || []);
		} catch (error) {
			console.error("Erreur chargement réservations:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelBooking = async (bookingId: string) => {
		if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) return;

		try {
			await api.put(`/bookings/${bookingId}/cancel`, {
				reason: "Annulée par le producteur",
			});
			fetchBookings();
		} catch (error: any) {
			alert(error.response?.data?.message || "Erreur lors de l'annulation");
		}
	};

	const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(
		null
	);

	const openDetails = async (bookingId: string) => {
		try {
			// Optionnel : Forcer la vérification du statut avant d'afficher
			try {
				const { paymentService } = await import(
					"../../../services/paymentService"
				);
				await paymentService.checkStatus(bookingId);
			} catch (e) {
				console.warn("Soft error checking payment status:", e);
			}

			const res = await api.get(`/bookings/${bookingId}`);
			setSelectedBooking(res.data.data || res.data.booking || null);
		} catch (err) {
			console.error("Failed to load booking detail", err);
			alert("Impossible de charger les détails");
		}
	};

	const closeDetails = () => setSelectedBooking(null);

	const getStatusBadge = (status: string) => {
		const statusConfig: {
			[key: string]: { bg: string; text: string; icon: any; label: string };
		} = {
			pending: {
				bg: "bg-yellow-100",
				text: "text-yellow-800",
				icon: Clock,
				label: "En attente",
			},
			confirmed: {
				bg: "bg-blue-100",
				text: "text-blue-800",
				icon: CheckCircle,
				label: "Confirmée",
			},
			in_progress: {
				bg: "bg-orange-100",
				text: "text-orange-800",
				icon: AlertCircle,
				label: "En cours",
			},
			completed: {
				bg: "bg-green-100",
				text: "text-green-800",
				icon: CheckCircle,
				label: "Terminée",
			},
			cancelled: {
				bg: "bg-red-100",
				text: "text-red-800",
				icon: XCircle,
				label: "Annulée",
			},
		};

		const config = statusConfig[status] || statusConfig.pending;
		const Icon = config.icon;

		return (
			<span
				className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} flex items-center space-x-1`}
			>
				<Icon className="w-4 h-4" />
				<span>{config.label}</span>
			</span>
		);
	};

	const getPaymentBadge = (booking: any) => {
		if (!booking) return null;
		const paymentStatus = booking.paymentStatus || booking.payment?.status;
		if (
			paymentStatus === "completed" ||
			paymentStatus === "paid" ||
			paymentStatus === "success"
		) {
			return (
				<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 flex items-center space-x-1">
					<CheckCircle className="w-4 h-4" />
					<span>Payé</span>
				</span>
			);
		}
		return (
			<span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200 flex items-center space-x-1">
				<AlertCircle className="w-4 h-4" />
				<span>Non payé</span>
			</span>
		);
	};

	const filteredBookings = bookings.filter((booking) => {
		if (filter === "all") return true;
		return booking.status === filter;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<div className="flex flex-col items-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
					<p className="mt-4 text-gray-500 font-medium">
						Chargement de vos réservations...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Mes Réservations</h2>
					<p className="text-gray-600 mt-1">
						{filteredBookings.length} réservation(s) de services
					</p>
				</div>

				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm outline-none"
				>
					<option value="all">Tous les statuts</option>
					<option value="pending">En attente</option>
					<option value="confirmed">Confirmées</option>
					<option value="in_progress">En cours</option>
					<option value="completed">Terminées</option>
					<option value="cancelled">Annulées</option>
				</select>
			</div>

			{filteredBookings.length === 0 ? (
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
					<div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
						<Calendar className="w-10 h-10 text-gray-300" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Aucune réservation
					</h3>
					<p className="text-gray-500 max-w-xs mx-auto">
						Vous n'avez pas encore de réservations de services actives.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredBookings.map((booking) => (
						<div
							key={booking.id}
							className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
						>
							<div className="p-6">
								<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
									<div className="flex items-start space-x-5 flex-1">
										{firstImageUrl(booking.service?.images) ? (
											<img
												src={firstImageUrl(booking.service?.images)}
												alt={booking.service?.name}
												className="w-24 h-24 object-cover rounded-xl shadow-inner"
											/>
										) : (
											<div className="w-24 h-24 bg-green-50 rounded-xl flex items-center justify-center">
												<Activity className="w-8 h-8 text-green-300" />
											</div>
										)}

										<div className="flex-1">
											<div className="flex flex-wrap items-center gap-3 mb-2">
												<h3 className="text-xl font-bold text-gray-900">
													{booking.service?.name || "Service"}
												</h3>
												{getStatusBadge(booking.status)}
												{getPaymentBadge(booking)}
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
												<div className="flex items-center text-gray-600">
													<Activity className="w-4 h-4 mr-2 text-gray-400" />
													<span className="capitalize">
														{booking.service?.serviceType}
													</span>
												</div>

												<div className="flex items-center text-gray-600">
													<Calendar className="w-4 h-4 mr-2 text-gray-400" />
													<span>
														{booking.duration}{" "}
														{booking.type === "hourly" ? "heure(s)" : "jour(s)"}
													</span>
												</div>

												<div className="flex items-center text-gray-600">
													<Clock className="w-4 h-4 mr-2 text-gray-400" />
													<span className="truncate">
														{booking.startDate
															? `Du ${new Date(
																	booking.startDate
															  ).toLocaleDateString("fr-FR")} au ${new Date(
																	booking.endDate
															  ).toLocaleDateString("fr-FR")}`
															: `Le ${new Date(
																	booking.bookingDate || ""
															  ).toLocaleDateString("fr-FR")} à ${
																	booking.startTime
															  }`}
													</span>
												</div>

												<div className="flex items-center">
													{getPaymentBadge(booking.paymentStatus)}
												</div>
											</div>

											{booking.notes && (
												<div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
													<p className="text-sm text-gray-600 flex items-start italic">
														<MessageCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
														<span>{booking.notes}</span>
													</p>
												</div>
											)}
										</div>
									</div>

									<div className="flex flex-col items-end gap-4 lg:ml-6 min-w-[200px]">
										<div className="text-right">
											<p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
												Montant total
											</p>
											<p className="text-2xl font-black text-green-600">
												{booking.totalPrice?.toLocaleString() || 0} FCFA
											</p>
										</div>

										<div className="flex flex-col space-y-2 w-full">
											{booking.status === "pending" && (
												<button
													onClick={() => handleCancelBooking(booking.id)}
													className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center space-x-2 font-medium"
												>
													<XCircle className="w-4 h-4" />
													<span>Annuler</span>
												</button>
											)}

											{booking.status === "completed" && (
												<button
													className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all flex items-center justify-center space-x-2 font-medium"
													onClick={() =>
														alert("Fonctionnalité d'évaluation à venir")
													}
												>
													<Star className="w-4 h-4" />
													<span>Évaluer le service</span>
												</button>
											)}

											<button
												onClick={() => openDetails(booking.id)}
												className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium border border-gray-200"
											>
												Voir les détails
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
								<div className="flex justify-between items-center text-xs text-gray-400 font-medium">
									<span className="font-mono">
										ID: #{booking.id.slice(-8).toUpperCase()}
									</span>
									<span>
										Réservé le{" "}
										{new Date(booking.createdAt).toLocaleDateString("fr-FR")}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Details modal */}
			{selectedBooking && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
					<div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
						<div className="bg-green-600 p-6 md:p-8 text-white relative flex-shrink-0">
							<button
								onClick={closeDetails}
								className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white transition-colors"
							>
								<XCircle className="w-6 h-6 md:w-8 md:h-8" />
							</button>
							<h3 className="text-xl md:text-2xl font-bold">
								Détails de la Réservation
							</h3>
							<p className="text-green-100 mt-1 font-mono text-sm">
								Référence: #{selectedBooking.id.toUpperCase()}
							</p>
						</div>

						<div className="p-6 md:p-8 overflow-y-auto scrollbar-hide">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="space-y-6">
									<div>
										<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
											Service
										</h4>
										<p className="text-lg font-bold text-gray-900 leading-tight">
											{selectedBooking.service?.name}
										</p>
										<p className="text-sm text-gray-500 mt-1 capitalize">
											Type: {selectedBooking.service?.serviceType}
										</p>
									</div>

									<div>
										<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
											Période de réservation
										</h4>
										<div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
											<p className="font-semibold text-gray-900">
												{selectedBooking.startDate
													? `Du ${new Date(
															selectedBooking.startDate
													  ).toLocaleDateString("fr-FR")}`
													: `Le ${new Date(
															selectedBooking.bookingDate || ""
													  ).toLocaleDateString("fr-FR")}`}
											</p>
											<p className="font-semibold text-gray-900">
												{selectedBooking.endDate
													? `Au ${new Date(
															selectedBooking.endDate
													  ).toLocaleDateString("fr-FR")}`
													: `À ${selectedBooking.startTime}`}
											</p>
											<p className="text-xs text-green-600 mt-2 font-bold">
												Durée totale: {selectedBooking.duration}{" "}
												{selectedBooking.type === "hourly"
													? "heure(s)"
													: "jour(s)"}
											</p>
										</div>
									</div>

									<div>
										<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
											Notes ou instructions
										</h4>
										<p className="text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
											{selectedBooking.notes || "Aucune note particulière"}
										</p>
									</div>
								</div>

								<div className="flex flex-col justify-between">
									<div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
										<p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-1">
											Prix Total
										</p>
										<p className="text-4xl font-black text-green-700">
											{selectedBooking.totalPrice?.toLocaleString() || 0}
										</p>
										<p className="text-lg font-bold text-green-700">FCFA</p>
									</div>

									<div className="mt-8 space-y-3">
										<div className="flex items-center justify-between px-2">
											<span className="text-sm font-medium text-gray-500">
												Statut de paiement
											</span>
											{getPaymentBadge(selectedBooking)}
										</div>

										{!(
											selectedBooking.paymentStatus === "paid" ||
											selectedBooking.paymentStatus === "success" ||
											selectedBooking.payment?.status === "success"
										) && (
											<div className="pt-4">
												<PayButton
													reservationId={selectedBooking.id}
													canPay={true}
													phoneNumber={selectedBooking.user?.phoneNumber}
												/>
											</div>
										)}

										<button
											onClick={closeDetails}
											className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
										>
											Fermer la fenêtre
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProducteurManageReservations;
