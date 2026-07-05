import React, { useEffect, useState } from "react";
import { servicesService } from "../../../services/servicesService";
import { Link } from "../../../router";
import { Tractor, Edit, Trash2, Plus, DollarSign, Clock } from "lucide-react";
import { Service } from "../../../lib/api";

export const PrestataireManageServices: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			const data = await servicesService.getMyServices();
			setServices(data);
		} catch (error) {
			console.error("Erreur chargement services:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleStatus = async (
		serviceId: string,
		currentStatus: boolean
	) => {
		try {
			await servicesService.updateAvailability(serviceId, !currentStatus);
			fetchServices();
		} catch (error: any) {
			alert(error.message || "Erreur lors du changement de disponibilité");
		}
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Supprimer "${name}" ?`)) return;

		try {
			await servicesService.deleteService(id);
			fetchServices();
		} catch (error: any) {
			alert(error.message || "Erreur lors de la suppression");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Mes Services</h2>
					<p className="text-gray-600 mt-1">
						{services.length} service(s) enregistré(s)
					</p>
				</div>
				<Link
					to="/create-service"
					className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
				>
					<Plus className="w-5 h-5" />
					<span>Ajouter un Service</span>
				</Link>
			</div>

			{services.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-12 text-center">
					<Tractor className="w-16 h-16 mx-auto text-gray-300 mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Aucun service
					</h3>
					<p className="text-gray-600 mb-6">
						Commencez par ajouter votre premier service ou matériel
					</p>
					<Link
						to="/create-service"
						className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition inline-block"
					>
						Ajouter un service
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map((service) => (
						<div
							key={service.id}
							className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
						>
							<div className="relative h-48 bg-gray-200">
								{service.images && service.images.length > 0 ? (
									<img
										src={service.images[0]}
										alt={service.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Tractor className="w-12 h-12 text-gray-400" />
									</div>
								)}
								<div className="absolute top-2 right-2">
									<span
										className={`px-2 py-1 rounded text-xs font-bold ${
											service.availability
												? "bg-green-500 text-white"
												: "bg-gray-500 text-white"
										}`}
									>
										{service.availability ? "Disponible" : "Indisponible"}
									</span>
								</div>
							</div>

							<div className="p-4 flex-1 flex flex-col">
								<h3 className="font-bold text-lg text-gray-900 mb-1">
									{service.name}
								</h3>
								<p className="text-sm text-gray-500 mb-4 line-clamp-2">
									{service.description}
								</p>

								<div className="space-y-2 mb-4">
									{service.pricePerDay && (
										<div className="flex items-center text-sm">
											<DollarSign className="w-4 h-4 mr-2 text-green-600" />
											<span>
												{service.pricePerDay.toLocaleString()} FCFA / jour
											</span>
										</div>
									)}
									{service.pricePerHour && (
										<div className="flex items-center text-sm">
											<Clock className="w-4 h-4 mr-2 text-blue-600" />
											<span>
												{service.pricePerHour.toLocaleString()} FCFA / heure
											</span>
										</div>
									)}
								</div>

								<div className="mt-auto pt-4 border-t flex space-x-2">
									<button
										onClick={() =>
											handleToggleStatus(service.id, service.availability)
										}
										className={`flex-1 py-2 rounded text-xs font-bold transition ${
											service.availability
												? "bg-orange-100 text-orange-700 hover:bg-orange-200"
												: "bg-green-100 text-green-700 hover:bg-green-200"
										}`}
									>
										{service.availability ? "Désactiver" : "Activer"}
									</button>
									<Link
										to={`/edit-service/${service.id}`}
										className="p-2 text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center"
										title="Modifier"
									>
										<Edit className="w-5 h-5" />
									</Link>
									<button
										onClick={() => handleDelete(service.id, service.name)}
										className="p-2 text-red-600 hover:bg-red-50 rounded transition"
										title="Supprimer"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PrestataireManageServices;
