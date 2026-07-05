import React, { useState } from "react";
import { Link } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, Tractor, User, LogOut, LayoutDashboard } from "lucide-react";

export const Header: React.FC = () => {
	const { user, profile, signOut } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			setMobileMenuOpen(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-3 group">
						<div className="relative">
							<div className="absolute inset-0 bg-green-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
							<div className="relative bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
								<Tractor className="w-7 h-7 text-white" />
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
								AlloTracteur
							</span>
							<span className="text-xs text-gray-500 -mt-1">
								Location d'équipements
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						<Link
							to="/"
							className="text-gray-700 hover:text-green-600 transition-colors font-medium"
						>
							Accueil
						</Link>
						<Link
							to="/services"
							className="text-gray-700 hover:text-green-600 transition-colors font-medium"
						>
							Services
						</Link>

						{user ? (
							<>
								<Link
									to="/dashboard"
									className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1"
								>
									<LayoutDashboard className="w-4 h-4" />
									<span>Tableau de bord</span>
								</Link>

								{profile?.role === "prestataire" && (
									<Link
										to="/create-service"
										className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
									>
										Ajouter un service
									</Link>
								)}

								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2 text-gray-700">
										<User className="w-5 h-5" />
										<span className="font-medium">
											{profile?.fullName || user.email}
										</span>
									</div>
									<button
										onClick={handleSignOut}
										className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
									>
										<LogOut className="w-5 h-5" />
										<span>Déconnexion</span>
									</button>
								</div>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								>
									Connexion
								</Link>
								<Link
									to="/register"
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
								>
									S'inscrire
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden text-gray-700 hover:text-green-600"
					>
						{mobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
						<div className="flex flex-col space-y-4">
							<Link
								to="/"
								className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								onClick={() => setMobileMenuOpen(false)}
							>
								Accueil
							</Link>
							<Link
								to="/services"
								className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								onClick={() => setMobileMenuOpen(false)}
							>
								Services
							</Link>

							{user ? (
								<>
									<Link
										to="/dashboard"
										className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2"
										onClick={() => setMobileMenuOpen(false)}
									>
										<LayoutDashboard className="w-4 h-4" />
										<span>Tableau de bord</span>
									</Link>

									{profile?.role === "prestataire" && (
										<Link
											to="/create-service"
											className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
											onClick={() => setMobileMenuOpen(false)}
										>
											Ajouter un service
										</Link>
									)}

									<div className="border-t border-gray-200 pt-4 mt-4">
										<div className="flex items-center space-x-2 text-gray-700 mb-4">
											<User className="w-5 h-5" />
											<span className="font-medium">
												{profile?.fullName || user.email}
											</span>
										</div>
										<button
											onClick={handleSignOut}
											className="w-full flex items-center justify-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
										>
											<LogOut className="w-5 h-5" />
											<span>Déconnexion</span>
										</button>
									</div>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="text-gray-700 hover:text-green-600 transition-colors font-medium"
										onClick={() => setMobileMenuOpen(false)}
									>
										Connexion
									</Link>
									<Link
										to="/register"
										className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
										onClick={() => setMobileMenuOpen(false)}
									>
										S'inscrire
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</nav>
		</header>
	);
};
