import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../../../router";
import { AlertCircle, Calendar } from "lucide-react";
import { Service } from "../../../lib/api";
import { bookingsService } from "../../../services/bookingsService";
import { paytechService } from "../../../services/paytechService";

interface BookingSidebarProps {
	service: Service;
	user: any;
	profile: any;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
	service,
	user,
	profile,
}) => {
	const { navigate } = useRouter();
	const [bookingType, setBookingType] = useState<"daily" | "hourly">("daily");
	const [reservationForm, setReservationForm] = useState({
		startDate: "",
		endDate: "",
		bookingDate: "",
		startTime: "",
		duration: 1,
		notes: "",
	});

	const [priceCalculation, setPriceCalculation] = useState({
		duration: 0,
		pricePerUnit: 0,
		subtotal: 0,
		discountPercentage: 0,
		discountAmount: 0,
		totalPrice: 0,
	});

	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const calculation = bookingsService.calculatePrice(
			{
				...reservationForm,
				type: bookingType,
			},
			service.pricePerDay || 0,
			service.pricePerHour || undefined
		);
		setPriceCalculation(calculation);
	}, [reservationForm, bookingType, service]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const value =
			e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
		setReservationForm({
			...reservationForm,
			[e.target.name]: value,
		});
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (!user) return navigate("/login");

		if (bookingType === "daily") {
			const startDate = new Date(reservationForm.startDate);
			const endDate = new Date(reservationForm.endDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (startDate < today) return setError("Date de début invalide");
			if (endDate < startDate) return setError("Date de fin invalide");
		} else {
			if (!reservationForm.bookingDate) return setError("Date requise");
			if (!reservationForm.startTime) return setError("Heure requise");
		}

		setSubmitting(true);

		try {
			const booking = await bookingsService.createBooking({
				serviceId: service.id,
				type: bookingType,
				startDate:
					bookingType === "daily" ? reservationForm.startDate : undefined,
				endDate: bookingType === "daily" ? reservationForm.endDate : undefined,
				bookingDate:
					bookingType === "hourly" ? reservationForm.bookingDate : undefined,
				startTime:
					bookingType === "hourly" ? reservationForm.startTime : undefined,
				duration:
					bookingType === "hourly" ? reservationForm.duration : undefined,
				notes: reservationForm.notes,
			});

			const payment = await paytechService.initiatePayment({
				bookingId: booking.id,
				amount: priceCalculation.totalPrice,
				phoneNumber:
					profile?.phoneNumber || user?.phoneNumber || "+221700000000",
				description: `Réservation de ${service.name}`,
			});

			if (!payment.success) {
				throw new Error(
					payment.error || "Erreur lors de l'initialisation du paiement"
				);
			}

			if (!payment.redirect_url) {
				// Mode simulation ou PayTech non configuré
				navigate(`/payment-success?booking=${booking.id}&simulated=true`);
				return;
			}

			window.location.href = payment.redirect_url;
		} catch (err: any) {
			setError(err.message || "Erreur lors de la réservation");
			setSubmitting(false);
		}
	};

	const isOwnService =
		profile?.role === "prestataire" && service.providerId === profile?.id;

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
			<div className="mb-6">
				<div className="text-3xl font-extrabold text-green-600 mb-1">
					{bookingType === "daily"
						? (service.pricePerDay || 0).toLocaleString()
						: (
								service.pricePerHour ||
								(service.pricePerDay ? service.pricePerDay / 8 : 0)
						  ).toLocaleString()}{" "}
					FCFA
				</div>
				<div className="text-gray-500 text-sm font-medium">
					par {bookingType === "daily" ? "jour" : "heure"}
				</div>
			</div>

			{/* Toggle Type */}
			<div className="flex p-1 bg-gray-100 rounded-lg mb-6">
				<button
					onClick={() => setBookingType("daily")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
						bookingType === "daily"
							? "bg-white text-green-600 shadow-sm"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Par Jour
				</button>
				<button
					onClick={() => setBookingType("hourly")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
						bookingType === "hourly"
							? "bg-white text-green-600 shadow-sm"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Par Heure
				</button>
			</div>

			{user ? (
				isOwnService ? (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-center font-medium">
						Ceci est votre machine
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-5">
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
								<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
								<p className="text-red-800 text-sm">{error}</p>
							</div>
						)}

						{bookingType === "daily" ? (
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
										Début
									</label>
									<input
										type="date"
										name="startDate"
										required
										value={reservationForm.startDate}
										onChange={handleInputChange}
										min={new Date().toISOString().split("T")[0]}
										className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
									/>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
										Fin
									</label>
									<input
										type="date"
										name="endDate"
										required
										value={reservationForm.endDate}
										onChange={handleInputChange}
										min={
											reservationForm.startDate ||
											new Date().toISOString().split("T")[0]
										}
										className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
									/>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
										Date
									</label>
									<input
										type="date"
										name="bookingDate"
										required
										value={reservationForm.bookingDate}
										onChange={handleInputChange}
										min={new Date().toISOString().split("T")[0]}
										className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
											Heure début
										</label>
										<input
											type="time"
											name="startTime"
											required
											value={reservationForm.startTime}
											onChange={handleInputChange}
											className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
											Durée (heures)
										</label>
										<input
											type="number"
											name="duration"
											min="1"
											max="24"
											required
											value={reservationForm.duration}
											onChange={handleInputChange}
											className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm"
										/>
									</div>
								</div>
							</div>
						)}

						<div>
							<label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
								Notes
							</label>
							<textarea
								name="notes"
								rows={2}
								value={reservationForm.notes}
								onChange={handleInputChange}
								className="block w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm resize-none"
								placeholder="Précisions pour le propriétaire..."
							/>
						</div>

						{priceCalculation.totalPrice > 0 && (
							<div className="bg-gray-50 rounded-xl p-4 space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">
										{priceCalculation.duration}{" "}
										{bookingType === "daily" ? "jour" : "heure"}
										{priceCalculation.duration > 1 ? "s" : ""} x{" "}
										{priceCalculation.pricePerUnit.toLocaleString()}
									</span>
									<span className="font-medium text-gray-900">
										{priceCalculation.subtotal.toLocaleString()} FCFA
									</span>
								</div>

								{priceCalculation.discountPercentage > 0 && (
									<div className="flex justify-between text-sm text-green-600">
										<span>
											Réduction -{priceCalculation.discountPercentage}%
										</span>
										<span>
											-{priceCalculation.discountAmount.toLocaleString()} FCFA
										</span>
									</div>
								)}

								<div className="border-t border-gray-200 pt-3 flex justify-between items-end">
									<span className="font-bold text-gray-900">Total à payer</span>
									<span className="text-xl font-bold text-green-600">
										{priceCalculation.totalPrice.toLocaleString()} FCFA
									</span>
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={submitting}
							className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all font-bold text-base shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
						>
							{submitting ? "Traitement..." : "Réserver maintenant"}
						</button>
					</form>
				)
			) : (
				<div className="space-y-4">
					<p className="text-gray-500 text-sm text-center mb-6">
						Connectez-vous pour réserver cette machine
					</p>

					<Link
						to="/login"
						className="block w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 transition-all font-bold text-center shadow-md shadow-green-100"
					>
						Se connecter
					</Link>

					<Link
						to="/register"
						className="block w-full bg-gray-100 text-gray-800 py-3.5 rounded-lg hover:bg-gray-200 transition-all font-bold text-center"
					>
						S'inscrire
					</Link>
				</div>
			)}
		</div>
	);
};
