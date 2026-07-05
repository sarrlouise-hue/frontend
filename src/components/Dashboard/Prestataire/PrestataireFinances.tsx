import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface Payout {
	status: string;
	amount: number;
	paidAt?: string;
}

interface Payment {
	amount: number;
	status: string;
	prestatairePayout: Payout;
	createdAt: string;
}

export default function PrestataireFinances() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMyPayouts();
	}, []);

	const fetchMyPayouts = async () => {
		try {
			setLoading(true);
			const res = await api.get("/finances/my-payouts");
			setPayments(res.data.data || []);
		} catch (error) {
			console.error("Erreur chargement paiements:", error);
		} finally {
			setLoading(false);
		}
	};

	const totalGagne = payments
		.filter((p) => p.prestatairePayout.status === "completed")
		.reduce((sum, p) => sum + (p.prestatairePayout.amount || 0), 0);
	const enAttente = payments
		.filter((p) => p.prestatairePayout.status === "pending")
		.reduce((sum, p) => sum + (p.prestatairePayout.amount || 0), 0);
	const totalVersements = payments.filter(
		(p) => p.prestatairePayout.status === "completed"
	).length;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency: "XOF",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-green-600">Total Gagné</p>
							<p className="text-2xl font-bold text-green-900 mt-2">
								{formatCurrency(totalGagne)}
							</p>
							<p className="text-xs text-green-600 mt-1">
								{totalVersements} versements
							</p>
						</div>
						<DollarSign className="w-12 h-12 text-green-500 opacity-50" />
					</div>
				</div>
				<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-orange-600">En Attente</p>
							<p className="text-2xl font-bold text-orange-900 mt-2">
								{formatCurrency(enAttente)}
							</p>
							<p className="text-xs text-orange-600 mt-1">Versements à venir</p>
						</div>
						<Clock className="w-12 h-12 text-orange-500 opacity-50" />
					</div>
				</div>
				<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-blue-600">
								Total Paiements
							</p>
							<p className="text-2xl font-bold text-blue-900 mt-2">
								{payments.length}
							</p>
							<p className="text-xs text-blue-600 mt-1">
								Toutes réservations payées
							</p>
						</div>
						<CheckCircle className="w-12 h-12 text-blue-500 opacity-50" />
					</div>
				</div>
			</div>
			{/* Liste détaillée des paiements si besoin */}
		</div>
	);
}
