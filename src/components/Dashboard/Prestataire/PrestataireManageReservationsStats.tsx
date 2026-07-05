import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api";

interface Reservation {
	_id: string;
	status: string;
	totalPrice: number;
}

export default function PrestataireManageReservationsStats() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchReservations();
	}, []);

	const fetchReservations = async () => {
		try {
			const response = await api.get("/reservations");
			setReservations(response.data.reservations || []);
		} catch (error) {
			setReservations([]);
		} finally {
			setLoading(false);
		}
	};

	const stats = {
		total: reservations.length,
		pending: reservations.filter((r) => r.status === "pending").length,
		confirmed: reservations.filter((r) => r.status === "confirmed").length,
		inProgress: reservations.filter((r) => r.status === "in_progress").length,
		completed: reservations.filter((r) => r.status === "completed").length,
		revenue: reservations
			.filter((r) => r.status === "completed")
			.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
	};

	if (loading) {
		return <div>Chargement statistiques réservations...</div>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
			<div className="bg-white rounded-lg shadow p-4">
				<p className="text-sm text-gray-600">Total</p>
				<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
			</div>
			<div className="bg-white rounded-lg shadow p-4">
				<p className="text-sm text-gray-600">En attente</p>
				<p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
			</div>
			<div className="bg-white rounded-lg shadow p-4">
				<p className="text-sm text-gray-600">Confirmées</p>
				<p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
			</div>
			<div className="bg-white rounded-lg shadow p-4">
				<p className="text-sm text-gray-600">En cours</p>
				<p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
			</div>
			<div className="bg-white rounded-lg shadow p-4">
				<p className="text-sm text-gray-600">Revenu total</p>
				<p className="text-xl font-bold text-green-600">
					{(stats.revenue / 1000).toFixed(0)}K FCFA
				</p>
			</div>
		</div>
	);
}
