import React, { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { providerService, Provider } from "../../services/providerService";

export const ProvidersList: React.FC = () => {
	const [providers, setProviders] = useState<Provider[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProviders = async () => {
			try {
				const data = await providerService.getApprovedProviders();
				setProviders(data);
			} catch (error) {
				console.error("Failed to fetch providers:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProviders();
	}, []);

	if (loading) {
		return (
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 text-center">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
						<div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
							))}
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Nos prestataires
					</h2>
					<p className="text-xl text-gray-600">
						Des professionnels vérifiés partout au Sénégal
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{providers.map((provider) => (
						<div
							key={provider.id}
							className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
						>
							<div className="flex items-start gap-4 mb-4">
								<img
									src={
										provider.user?.profileImage ||
										"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
									}
									alt={provider.businessName}
									className="w-16 h-16 rounded-full object-cover bg-gray-100"
								/>
								<div className="flex-1">
									<h3 className="text-lg font-bold text-gray-900">
										{provider.user
											? `${provider.user.firstName} ${provider.user.lastName}`
											: provider.businessName}
									</h3>
									<div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
										<MapPin className="w-4 h-4" />
										{provider.city || provider.location || "Sénégal"}
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="flex gap-0.5">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-4 h-4 ${
													i < Math.round(Number(provider.rating || 0))
														? "fill-yellow-400 text-yellow-400"
														: "fill-gray-200 text-gray-200"
												}`}
											/>
										))}
									</div>
									<span className="text-sm font-semibold text-gray-900">
										{Number(provider.rating || 0).toFixed(1)}
									</span>
									<span className="text-sm text-gray-500">
										({provider.reviewCount || 0} avis)
									</span>
								</div>
							</div>
							<div className="mt-4 pt-4 border-t border-gray-100">
								<p className="text-sm text-gray-600">
									{provider.machineCount || 0} machines disponibles
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
