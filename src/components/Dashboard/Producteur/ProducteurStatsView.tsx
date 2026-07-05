import React from "react";
import {
	Calendar,
	DollarSign,
	TrendingUp,
	Package,
	Search,
} from "lucide-react";
import { Link } from "../../../router";

interface ProducteurStatsViewProps {
	stats: {
		reservations: {
			total: number;
			enAttente: number;
			confirmees: number;
			enCours: number;
			terminees: number;
			annulees: number;
		};
		finances: {
			depensesTotales: number;
		};
	} | null;
}

export const ProducteurStatsView: React.FC<ProducteurStatsViewProps> = ({
	stats,
}) => {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Mes Réservations</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.reservations.total || 0}
							</p>
							<p className="text-xs text-blue-600 mt-1">
								{stats?.reservations.enCours || 0} en cours
							</p>
						</div>
						<Calendar className="w-12 h-12 text-blue-500" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">En Attente</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.reservations.enAttente || 0}
							</p>
							<p className="text-xs text-yellow-600 mt-1">À confirmer</p>
						</div>
						<Package className="w-12 h-12 text-yellow-500" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Terminées</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.reservations.terminees || 0}
							</p>
							<p className="text-xs text-green-600 mt-1">Complétées</p>
						</div>
						<TrendingUp className="w-12 h-12 text-green-500" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Dépenses Totales</p>
							<p className="text-3xl font-bold text-gray-900">
								{((stats?.finances.depensesTotales || 0) / 1000).toFixed(0)}K
							</p>
							<p className="text-xs text-gray-600 mt-1">FCFA</p>
						</div>
						<DollarSign className="w-12 h-12 text-emerald-500" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-bold mb-4">État de mes Réservations</h2>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-gray-600">En attente</span>
							<span className="font-bold text-lg text-yellow-600">
								{stats?.reservations.enAttente || 0}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Confirmées</span>
							<span className="font-bold text-lg text-blue-600">
								{stats?.reservations.confirmees || 0}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">En cours</span>
							<span className="font-bold text-lg text-orange-600">
								{stats?.reservations.enCours || 0}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Terminées</span>
							<span className="font-bold text-lg text-green-600">
								{stats?.reservations.terminees || 0}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Annulées</span>
							<span className="font-bold text-lg text-red-600">
								{stats?.reservations.annulees || 0}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-bold mb-4">Finances</h2>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Total payé</span>
							<span className="font-bold text-lg text-emerald-600">
								{(stats?.finances.depensesTotales || 0).toLocaleString()} FCFA
							</span>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-gray-500">En attente de paiement</span>
							<span className="font-semibold text-orange-600">
								{(
									(stats?.finances as any)?.enAttentePaiement || 0
								).toLocaleString()}{" "}
								FCFA
							</span>
						</div>
						<div className="flex justify-between items-center pt-2 border-t">
							<span className="text-gray-600 font-bold">Total général</span>
							<span className="font-bold text-lg text-gray-900">
								{(
									(stats?.finances.depensesTotales || 0) +
									((stats?.finances as any)?.enAttentePaiement || 0)
								).toLocaleString()}{" "}
								FCFA
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Moyenne par location</span>
							<span className="font-bold text-lg">
								{(stats?.reservations?.total ?? 0) > 0
									? (
											(stats?.finances?.depensesTotales ?? 0) /
											(stats?.reservations?.total ?? 1) /
											1000
									  ).toFixed(0)
									: "0"}
								K FCFA
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<div className="flex items-center space-x-4">
					<div className="bg-blue-100 rounded-full p-3">
						<Search className="w-8 h-8 text-blue-600" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-bold text-gray-900">
							Besoin d'équipement ?
						</h3>
						<p className="text-gray-600">
							Explorez notre catalogue de machines agricoles disponibles
						</p>
					</div>
					<Link
						to="/machines"
						className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
					>
						Parcourir
					</Link>
				</div>
			</div>
		</>
	);
};
