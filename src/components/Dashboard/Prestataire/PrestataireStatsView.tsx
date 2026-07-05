import React from "react";
import { Tractor, Calendar, DollarSign, TrendingUp, User } from "lucide-react";

interface PrestataireStatsViewProps {
	stats: {
		overview: {
			totalServices: number;
			activeServices: number;
			totalBookings: number;
			activeBookings: number;
			pendingBookings: number;
			completedBookings: number;
			totalEarnings: number;
			pendingEarnings: number;
		};
	} | null;
	user: any;
	onManageProfile: () => void;
}

export const PrestataireStatsView: React.FC<PrestataireStatsViewProps> = ({
	stats,
	user,
	onManageProfile,
}) => {
	const overview = stats?.overview;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm font-medium text-gray-500 uppercase">
							Mes Services
						</p>
						<Tractor className="w-8 h-8 text-green-500 opacity-20" />
					</div>
					<div className="flex items-baseline space-x-2">
						<p className="text-3xl font-bold text-gray-900">
							{overview?.totalServices || 0}
						</p>
						<p className="text-xs text-green-600 font-bold">
							{overview?.activeServices || 0} Actifs
						</p>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm font-medium text-gray-500 uppercase">
							Réservations
						</p>
						<Calendar className="w-8 h-8 text-blue-500 opacity-20" />
					</div>
					<div className="flex items-baseline space-x-2">
						<p className="text-3xl font-bold text-gray-900">
							{overview?.totalBookings || 0}
						</p>
						<p className="text-xs text-blue-600 font-bold">
							{overview?.pendingBookings || 0} En attente
						</p>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm font-medium text-gray-500 uppercase">
							Revenu Global
						</p>
						<DollarSign className="w-8 h-8 text-emerald-500 opacity-20" />
					</div>
					<div className="flex items-baseline space-x-2">
						<p className="text-3xl font-bold text-gray-900">
							{((overview?.totalEarnings || 0) / 1000).toFixed(0)}K
						</p>
						<p className="text-xs text-emerald-600 font-bold">FCFA</p>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm font-medium text-gray-500 uppercase">
							Taux de succès
						</p>
						<TrendingUp className="w-8 h-8 text-orange-500 opacity-20" />
					</div>
					<div className="flex items-baseline space-x-2">
						<p className="text-3xl font-bold text-gray-900">
							{overview?.totalBookings
								? Math.round(
										(overview.completedBookings / overview.totalBookings) * 100
								  )
								: 0}
							%
						</p>
						<p className="text-xs text-orange-600 font-bold">Complétées</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-xl font-bold mb-6 text-gray-900">
						Activité des réservations
					</h2>
					<div className="space-y-4">
						<div className="flex justify-between items-center py-2 border-b border-gray-50">
							<span className="text-gray-600">En attente de confirmation</span>
							<span className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
								{overview?.pendingBookings || 0}
							</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-50">
							<span className="text-gray-600">Réservations actives</span>
							<span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
								{overview?.activeBookings || 0}
							</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-50">
							<span className="text-gray-600">Réservations terminées</span>
							<span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
								{overview?.completedBookings || 0}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-xl font-bold mb-6 text-gray-900">
						Revenus détaillés
					</h2>
					<div className="space-y-4">
						<div className="flex justify-between items-center py-2 border-b border-gray-50">
							<span className="text-gray-600">Revenu encaissé</span>
							<span className="font-bold text-emerald-600">
								{(overview?.totalEarnings || 0).toLocaleString()} FCFA
							</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
							<span className="text-gray-500">En attente de paiement</span>
							<span className="font-semibold text-orange-600">
								{(overview?.pendingEarnings || 0).toLocaleString()} FCFA
							</span>
						</div>
						<div className="flex justify-between items-center pt-4">
							<span className="text-gray-900 font-bold">Total prévu</span>
							<span className="font-black text-xl text-gray-900">
								{(
									(overview?.totalEarnings || 0) +
									(overview?.pendingEarnings || 0)
								).toLocaleString()}{" "}
								FCFA
							</span>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-xl font-bold mb-6 text-gray-900">Mon Profil</h2>
					<div className="flex items-center space-x-4 mb-6">
						<div className="bg-green-100 p-4 rounded-full text-green-700">
							<User className="w-8 h-8" />
						</div>
						<div>
							<p className="text-lg font-bold text-gray-900">
								{user?.firstName} {user?.lastName}
							</p>
							<p className="text-sm text-gray-500">Prestataire vérifié</p>
						</div>
					</div>
					<button
						onClick={onManageProfile}
						className="w-full py-3 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
					>
						Gérer mon profil
					</button>
				</div>
			</div>
		</div>
	);
};
