import React from "react";
import { ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
	const steps = [
		{
			step: "1",
			title: "Recherchez",
			description:
				"Parcourez notre catalogue et trouvez le matériel parfait pour vos besoins",
			image:
				"https://images.pexels.com/photos/5475762/pexels-photo-5475762.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
		{
			step: "2",
			title: "Réservez",
			description:
				"Sélectionnez vos dates, payez en ligne de manière sécurisée",
			image:
				"https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
		{
			step: "3",
			title: "Utilisez",
			description: "Récupérez votre machine et réalisez vos travaux agricoles",
			image:
				"https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
	];

	return (
		<section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4">
						Comment ça marche ?
					</h2>
					<p className="text-xl text-green-100">
						Trois étapes simples pour louer votre matériel
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((step, index) => (
						<div key={index} className="relative">
							<div className="bg-white rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
								<div className="relative h-48">
									<img
										src={step.image}
										alt={step.title}
										className="w-full h-full object-cover"
									/>
									<div className="absolute top-4 left-4 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
										{step.step}
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-2xl font-bold text-gray-900 mb-3">
										{step.title}
									</h3>
									<p className="text-gray-600">{step.description}</p>
								</div>
							</div>
							{index < 2 && (
								<div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
									<ArrowRight className="w-8 h-8 text-white" />
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
