import React from "react";
import { Search, Tractor, Users, Calendar, Shield, Zap } from "lucide-react";

export const Features: React.FC = () => {
	const features = [
		{
			icon: Search,
			title: "Recherche simplifiée",
			description:
				"Trouvez rapidement le matériel dont vous avez besoin près de chez vous avec notre système de filtres avancés",
			color: "blue",
		},
		{
			icon: Calendar,
			title: "Réservation en ligne",
			description:
				"Réservez en quelques clics et recevez une confirmation immédiate. Gérez vos réservations depuis votre dashboard",
			color: "green",
		},
		{
			icon: Shield,
			title: "Paiement sécurisé",
			description:
				"Transactions 100% sécurisées via Orange Money, Wave, Free Money et PayTech",
			color: "purple",
		},
		{
			icon: Users,
			title: "Prestataires vérifiés",
			description:
				"Tous nos prestataires sont vérifiés et évalués par la communauté pour garantir la qualité",
			color: "orange",
		},
		{
			icon: Tractor,
			title: "Large choix",
			description:
				"Des centaines de machines: tracteurs, moissonneuses, semoirs, pulvérisateurs et plus",
			color: "emerald",
		},
		{
			icon: Zap,
			title: "Service rapide",
			description:
				"Réponse en moins de 24h et mise à disposition rapide du matériel",
			color: "red",
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Pourquoi choisir ALLOTRACTEUR ?
					</h2>
					<p className="text-xl text-gray-600">
						Une plateforme complète pour tous vos besoins agricoles
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
						>
							<div
								className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
							>
								<feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
