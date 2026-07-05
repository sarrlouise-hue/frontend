import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { reservationsService } from "../../services/reservationsService";
import { bookingsService } from "../../services/bookingsService";
import { Reservation } from "../../types";
import { XCircle, AlertTriangle, RefreshCw } from "lucide-react";

export const PaymentCancel: React.FC = () => {
	const { user } = useAuth();
	const { navigate, currentPath } = useRouter();
	const [reservation, setReservation] = useState<Reservation | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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
	}, [user, currentPath]);

	const loadBooking = async (id: string) => {
		try {
			const data = await bookingsService.getBookingById(id);
			if (!data) {
				navigate("/dashboard");
				return;
			}
			setReservation(data as any);
		} catch (error) {
			console.error("Error loading booking:", error);
			navigate("/dashboard");
		} finally {
			setLoading(false);
		}
	};

	const loadReservation = async (reservationId: string) => {
		try {
			const data = await reservationsService.getReservationById(reservationId);
			if (!data) {
				navigate("/dashboard");
				return;
			}
			setReservation(data);
		} catch (error) {
			console.error("Error loading reservation:", error);
			navigate("/dashboard");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	if (!reservation) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-2xl">
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-red-600 text-white p-8 text-center">
						<div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
							<XCircle className="w-12 h-12 text-red-600" />
						</div>
						<h1 className="text-3xl font-bold mb-2">Paiement annulé</h1>
						<p className="text-red-100">Votre paiement n'a pas été effectué</p>
					</div>

					<div className="p-8 text-center">
						<Link
							to="/dashboard"
							className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition"
						>
							Retour au tableau de bord
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
