import React from "react";
import { Settings, Calendar, Award, Star } from "lucide-react";
import { Service } from "../../../lib/api";

interface ServiceInfoProps {
	service: Service;
}

export const ServiceInfo: React.FC<ServiceInfoProps> = ({ service }) => {
	// Mock specific details if not available in API yet
	const details = [
		{
			label: "Marque",
			value: service.brand || "Kubota", // Fallback to mock/default
			icon: <Award className="w-5 h-5 text-gray-500" />,
		},
		{
			label: "Modèle",
			value: service.model || "M7040",
			icon: <Settings className="w-5 h-5 text-gray-500" />,
		},
		{
			label: "Année",
			value: service.year || "2022", // Use string for year
			icon: <Calendar className="w-5 h-5 text-gray-500" />,
		},
		{
			label: "État",
			value: service.condition || "Non spécifié",
			icon: <Star className="w-5 h-5 text-gray-500" />,
		},
	];

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
			{/* Header Section */}
			<div className="flex items-start justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{service.name}
					</h1>
					<div className="flex items-center text-gray-500 text-sm">
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span>{service.location || "Sénégal"}</span>
						{/* Location fallback */}
					</div>
				</div>
				{service.serviceType && (
					<span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
						{service.serviceType}
					</span>
				)}
			</div>

			{/* Key Details Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{details.map((detail, index) => (
					<div key={index} className="bg-gray-50 rounded-lg p-4">
						<div className="flex items-center mb-2">
							{detail.icon}
							<span className="text-xs text-gray-500 ml-2 font-medium uppercase tracking-wide">
								{detail.label}
							</span>
						</div>
						<div className="font-semibold text-gray-900 ml-7">
							{detail.value}
						</div>
					</div>
				))}
			</div>

			{/* Description */}
			<div className="mb-8">
				<h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
				<p className="text-gray-600 leading-relaxed text-sm">
					{service.description}
				</p>
			</div>

			{/* Technical Specs - Horizontal Lines */}
			<div className="mb-8">
				<h2 className="text-lg font-bold text-gray-900 mb-4">
					Spécifications Techniques
				</h2>
				<div className="space-y-4">
					{Object.entries(
						service.technicalSpecifications || {
							Power: "70 CV",
							FuelType: "diesel",
						}
					).map(([key, value]) => (
						<div
							key={key}
							className="flex justify-between border-b border-gray-100 pb-2"
						>
							<span className="text-gray-500 text-sm capitalize">{key}</span>
							<span className="text-gray-900 font-medium text-sm">
								{String(value)}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Owner Info */}
			{service.provider && (
				<div className="pt-6">
					<h2 className="text-lg font-bold text-gray-900 mb-4">Propriétaire</h2>
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
							{(
								service.provider.businessName ||
								service.provider.user?.firstName ||
								"P"
							)
								.charAt(0)
								.toUpperCase()}
						</div>
						<div>
							<p className="font-bold text-gray-900 text-sm">
								{service.provider.businessName ||
									(service.provider.user
										? `${service.provider.user.firstName} ${service.provider.user.lastName}`
										: "Prestataire AlloTracteur")}
							</p>
							<div className="flex items-center text-yellow-500 text-xs mt-1">
								<Star className="w-3 h-3 fill-current" />
								<span className="ml-1 text-gray-500 font-medium">
									0.0 (0 avis)
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
