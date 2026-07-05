import React from "react";
import { Link } from "../../router";
import { Search, Tractor, ArrowRight, Star } from "lucide-react";

interface HeroProps {
	totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
	return (
		<section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
				<div
					className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
				<div
					className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
					style={{ animationDelay: "4s" }}
				></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
							<Star className="w-4 h-4 fill-current" />
							<span>Plateforme N°1 au Sénégal</span>
						</div>

						<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
							Louez du matériel agricole
							<span className="block text-green-600 mt-2">
								en toute simplicité
							</span>
						</h1>

						<p className="text-xl text-gray-600 leading-relaxed">
							ALLOTRACTEUR connecte les producteurs agricoles aux prestataires
							de services partout au Sénégal. Trouvez, réservez et utilisez le
							matériel dont vous avez besoin.
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<Link to="/machines">
								<button className="group flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
									<Search className="w-5 h-5" />
									Rechercher du matériel
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</button>
							</Link>

							<Link to="/register">
								<button className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
									Devenir prestataire
								</button>
							</Link>
						</div>

						<div className="flex items-center gap-8 pt-4">
							<div className="flex -space-x-3">
								<img
									src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
									alt="User"
									className="w-10 h-10 rounded-full border-2 border-white object-cover"
								/>
								<img
									src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
									alt="User"
									className="w-10 h-10 rounded-full border-2 border-white object-cover"
								/>
								<img
									src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
									alt="User"
									className="w-10 h-10 rounded-full border-2 border-white object-cover"
								/>
								<div className="w-10 h-10 rounded-full border-2 border-white bg-green-600 flex items-center justify-center text-white text-sm font-bold">
									+500
								</div>
							</div>
							<div>
								<div className="flex gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className="w-4 h-4 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<p className="text-sm text-gray-600 mt-1">
									500+ producteurs satisfaits
								</p>
							</div>
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl transform rotate-3"></div>
						<img
							src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800"
							alt="Tracteur dans un champ"
							className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px]"
						/>
						<div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
									<Tractor className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900">
										{totalCount || 0}+
									</p>
									<p className="text-sm text-gray-600">Machines disponibles</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
