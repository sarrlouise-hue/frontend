import React from "react";
import { Link } from "../../router";
import { Tractor, MapPin, Loader } from "lucide-react";
import { Service } from "../../lib/api";

interface AvailableServicesProps {
	loading: boolean;
	recentServices: Service[];
}

export const AvailableServices: React.FC<AvailableServicesProps> = ({
	loading,
	recentServices,
}) => {
	const getFirstImage = (images: string[]) => {
		if (images && images.length > 0) return images[0];
		return "https://images.pexels.com/photos/2252618/pexels-photo-2252618.jpeg?auto=compress&cs=tinysrgb&w=400";
	};

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Matériel disponible
					</h2>
					<p className="text-xl text-gray-600">
						Découvrez notre large gamme de machines agricoles
					</p>
				</div>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-12">
						<Loader className="w-12 h-12 animate-spin text-green-600 mb-4" />
						<p className="text-gray-600">Chargement du matériel...</p>
					</div>
				) : recentServices.length > 0 ? (
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{recentServices.map((service) => (
							<Link key={service.id} to={`/services/${service.id}`}>
								<div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
									<div className="relative h-56 overflow-hidden">
										<img
											src={getFirstImage(service.images)}
											alt={service.name}
											className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
										/>
										<div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600">
											Disponible
										</div>
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
											{service.name}
										</h3>
										<div className="flex items-center text-gray-600 text-sm mb-3">
											<MapPin className="w-4 h-4 mr-1" />
											<span>{service.provider?.address || "Sénégal"}</span>
										</div>
										<p className="text-green-600 font-bold text-lg">
											{service.pricePerDay
												? `${service.pricePerDay.toLocaleString()} FCFA/jour`
												: service.pricePerHour
												? `${service.pricePerHour.toLocaleString()} FCFA/heure`
												: "Prix sur demande"}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
						<Tractor className="w-16 h-16 mx-auto text-gray-300 mb-4" />
						<p className="text-gray-600 text-lg">
							Aucun matériel n'est disponible pour le moment.
						</p>
						<Link
							to="/register"
							className="text-green-600 font-bold hover:underline mt-2 inline-block"
						>
							Soyez le premier à proposer votre matériel !
						</Link>
					</div>
				)}
			</div>
		</section>
	);
};
