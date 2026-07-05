import React from "react";
import { Link } from "../../router";

export const CTA: React.FC = () => {
	return (
		<section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
			<div className="max-w-4xl mx-auto px-4 text-center">
				<h2 className="text-4xl font-bold text-white mb-6">
					Prêt à commencer ?
				</h2>
				<p className="text-xl text-green-100 mb-8">
					Rejoignez des milliers de producteurs qui font confiance à
					ALLOTRACTEUR
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link to="/register">
						<button className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 shadow-xl transform hover:-translate-y-1 transition-all duration-200">
							Créer un compte gratuitement
						</button>
					</Link>
					<Link to="/machines">
						<button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200">
							Explorer les offres
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
};
