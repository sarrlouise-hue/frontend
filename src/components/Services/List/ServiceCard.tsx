import React from "react";
import { Link } from "../../../router";
import { Tractor, MapPin } from "lucide-react";
import { Service } from "../../../lib/api";

interface ServiceCardProps {
	service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
	return (
		<Link
			to={`/services/${service.id}`}
			className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
		>
			<div className="h-48 bg-gray-200">
				{service.images && service.images.length > 0 ? (
					<img
						src={service.images[0]}
						alt={service.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Tractor className="w-16 h-16 text-gray-400" />
					</div>
				)}
			</div>
			<div className="p-6 flex-1 flex flex-col">
				<div className="flex items-start justify-between mb-2">
					<h3 className="text-xl font-semibold flex-1">{service.name}</h3>
					{service.serviceType && (
						<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium ml-2">
							{service.serviceType}
						</span>
					)}
				</div>
				<p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center space-x-2 text-gray-500">
						<MapPin className="w-4 h-4" />
						<span className="text-sm">{service.location || "Sénégal"}</span>
					</div>
					<div className="flex items-center space-x-1 text-green-600 font-bold">
						<span className="text-2xl">
							{(service.pricePerDay || 0).toLocaleString()}
						</span>
						<span className="text-sm">FCFA/j</span>
					</div>
				</div>
			</div>
		</Link>
	);
};
