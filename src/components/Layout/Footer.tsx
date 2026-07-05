import React from "react";
import { Link } from "../../router";
import {
	Tractor,
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Instagram,
} from "lucide-react";

export const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* About Section */}
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<Tractor className="w-8 h-8 text-green-500" />
							<span className="text-2xl font-bold text-white">
								AlloTracteur
							</span>
						</div>
						<p className="text-gray-400 mb-4">
							La plateforme de location de matériel agricole au Sénégal.
							Connectez producteurs et prestataires pour une agriculture moderne
							et efficace.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Facebook className="w-5 h-5" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Instagram className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">
							Liens rapides
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Accueil
								</Link>
							</li>
							<li>
								<Link
									to="/machines"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Machines disponibles
								</Link>
							</li>
							<li>
								<Link
									to="/register"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									S'inscrire
								</Link>
							</li>
							<li>
								<Link
									to="/login"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Connexion
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">Services</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Location de tracteurs
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Location de moissonneuses
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Équipements d'irrigation
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									Outils agricoles
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
						<ul className="space-y-3">
							<li className="flex items-start space-x-3">
								<MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
								<span className="text-gray-400">
									Dakar, Sénégal
									<br />
									Région de Thiès
								</span>
							</li>
							<li className="flex items-center space-x-3">
								<Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
								<a
									href="tel:+221123456789"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									+221 12 345 67 89
								</a>
							</li>
							<li className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
								<a
									href="mailto:contact@allotracteur.sn"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									contact@allotracteur.sn
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; {currentYear} AlloTracteur. Tous droits réservés.
					</p>
					<div className="flex space-x-6">
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							Conditions d'utilisation
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							Politique de confidentialité
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							CGV
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
