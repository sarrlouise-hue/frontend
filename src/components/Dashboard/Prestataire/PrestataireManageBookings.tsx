import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { bookingsService } from "../../../services/bookingsService";
import {
	Calendar,
	User,
	DollarSign,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Search,
	Eye,
} from "lucide-react";
import { Booking } from "../../../lib/api";

export const PrestataireManageBookings: React.FC = () => {
	const { user } = useAuth();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			const data = await bookingsService.getReceivedBookings();
			setBookings(data);
		} catch (error) {
			console.error("Erreur chargement réservations:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleConfirm = async (id: string) => {
		if (!confirm("Confirmer cette réservation ?")) return;
		try {
			await bookingsService.confirmBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de la confirmation");
		}
	};

	const handleCancel = async (id: string) => {
		if (!confirm("Annuler cette réservation ?")) return;
		try {
			await bookingsService.cancelBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de l'annulation");
		}
	};

	const handleComplete = async (id: string) => {
		if (!confirm("Marquer comme terminée ?")) return;
		try {
			await bookingsService.completeBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de la finalisation");
		}
	};

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
		const paymentStatus =
			booking.paymentStatus || booking.payment?.status || "pending";
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
		const matchesFilter = filter === "all" || booking.status === filter;
		const matchesSearch =
			searchTerm === "" ||
			booking.user?.firstName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			booking.user?.lastName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			booking.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Rechercher par client ou service..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
					/>
				</div>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-4 py-2 border border-gray-300 rounded-lg"
				>
					<option value="all">Tous les statuts</option>
					<option value="pending">En attente</option>
					<option value="confirmed">Confirmées</option>
					<option value="completed">Terminées</option>
					<option value="cancelled">Annulées</option>
				</select>
			</div>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Client
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Service
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Période
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Montant
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Paiement
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredBookings.map((booking) => (
								<tr
									key={booking.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="bg-green-100 p-2 rounded-full mr-3 text-green-700">
												<User className="w-4 h-4" />
											</div>
											<div>
												<div className="text-sm font-bold text-gray-900">
													{booking.user?.firstName} {booking.user?.lastName}
												</div>
												<div className="text-xs text-gray-500">
													{booking.user?.phoneNumber}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
										{booking.service?.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{booking.startDate ? (
											<>
												<div>
													Du{" "}
													{new Date(booking.startDate).toLocaleDateString(
														"fr-FR"
													)}
												</div>
												<div>
													Au{" "}
													{new Date(booking.endDate).toLocaleDateString(
														"fr-FR"
													)}
												</div>
											</>
										) : (
											<div>
												Le{" "}
												{new Date(booking.bookingDate || "").toLocaleDateString(
													"fr-FR"
												)}{" "}
												à {booking.startTime}
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-bold text-green-600">
											{booking.totalPrice?.toLocaleString()} FCFA
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(booking.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getPaymentBadge(booking)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex space-x-2">
											{booking.status === "pending" && (
												<>
													<button
														onClick={() => handleConfirm(booking.id)}
														className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
													>
														Confirmer
													</button>
													<button
														onClick={() => handleCancel(booking.id)}
														className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition"
													>
														Refuser
													</button>
												</>
											)}
											{booking.status === "confirmed" && (
												<button
													onClick={() => handleComplete(booking.id)}
													className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
												>
													Terminer
												</button>
											)}
											<button
												onClick={() => setSelectedBooking(booking)}
												className="p-1 text-gray-500 hover:text-green-600 transition"
												title="Voir détails"
											>
												<Eye className="w-5 h-5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{filteredBookings.length === 0 && (
						<div className="text-center py-12 text-gray-500">
							Aucune réservation trouvée.
						</div>
					)}
				</div>
			</div>

			{/* Modal Détails */}
			{selectedBooking && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
						<div className="bg-green-600 p-6 md:p-8 text-white relative flex-shrink-0">
							<button
								onClick={() => setSelectedBooking(null)}
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
											Client
										</h4>
										<div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center">
											<div className="bg-green-100 p-3 rounded-full mr-3 text-green-700">
												<User className="w-5 h-5" />
											</div>
											<div>
												<p className="font-bold text-gray-900 leading-tight">
													{selectedBooking.user?.firstName}{" "}
													{selectedBooking.user?.lastName}
												</p>
												<p className="text-sm text-gray-500 mt-1">
													{selectedBooking.user?.phoneNumber}
												</p>
												<p className="text-xs text-gray-400 mt-0.5">
													{selectedBooking.user?.email}
												</p>
											</div>
										</div>
									</div>

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
													  ).toLocaleDateString("fr-FR")} au ${new Date(
															selectedBooking.endDate
													  ).toLocaleDateString("fr-FR")}`
													: `Le ${new Date(
															selectedBooking.bookingDate || ""
													  ).toLocaleDateString("fr-FR")} à ${
															selectedBooking.startTime
													  }`}
											</p>
											<p className="text-xs text-green-600 mt-2 font-bold">
												Durée totale: {selectedBooking.duration}{" "}
												{selectedBooking.type === "hourly"
													? "heure(s)"
													: "jour(s)"}
											</p>
										</div>
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

									<div className="mt-8 space-y-4">
										<div className="flex items-center justify-between px-2">
											<span className="text-sm font-medium text-gray-500">
												Statut Réservation
											</span>
											{getStatusBadge(selectedBooking.status)}
										</div>

										<div className="flex items-center justify-between px-2">
											<span className="text-sm font-medium text-gray-500">
												Statut Paiement
											</span>
											{getPaymentBadge(selectedBooking)}
										</div>

										<div>
											<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
												Notes du client
											</h4>
											<div className="text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-sm">
												{selectedBooking.notes || "Aucune note particulière"}
											</div>
										</div>

										<button
											onClick={() => setSelectedBooking(null)}
											className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors pt-6"
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

export default PrestataireManageBookings;
