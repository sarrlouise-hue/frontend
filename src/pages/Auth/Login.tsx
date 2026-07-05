import React, { useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { Tractor, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export const Login: React.FC = () => {
	const { signIn } = useAuth();
	const { navigate } = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn(email, password);
			navigate("/dashboard");
		} catch (err: any) {
			setError(err.message || "Email ou mot de passe incorrect");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-[420px] w-full bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10">
				{/* Header Section */}
				<div className="text-center mb-8">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 mb-6 group"
					>
						<Tractor
							className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform"
							strokeWidth={2.5}
						/>
						<span className="text-2xl font-bold text-gray-900">
							AlloTracteur
						</span>
					</Link>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
					<p className="text-gray-500 text-sm">
						Connectez-vous à votre compte pour continuer
					</p>
				</div>

				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col items-start gap-2">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
							<p className="text-red-800 text-sm font-medium">{error}</p>
						</div>
						{error.includes("vérifier votre compte") && (
							<button
								type="button"
								onClick={() => navigate("/verify-otp", { state: { email } })}
								className="text-sm font-bold text-red-700 hover:text-red-900 hover:underline ml-8"
							>
								→ Aller à la page code de validation
							</button>
						)}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							Email
						</label>
						<div className="relative">
							<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="votre@email.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							Mot de passe
						</label>
						<div className="relative">
							<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-11 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="........"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-between mt-2">
						<label className="flex items-center text-sm text-gray-600 cursor-pointer">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2 h-4 w-4"
							/>
							Se souvenir de moi
						</label>
						<Link
							to="/forgot-password"
							className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
						>
							Mot de passe oublié ?
						</Link>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 transition-all font-bold text-base shadow-sm disabled:opacity-50 mt-4"
					>
						{loading ? "Connexion..." : "Se connecter"}
					</button>
				</form>

				<div className="pt-6 text-center text-sm">
					<p className="text-gray-500">
						Vous n'avez pas de compte ?{" "}
						<Link
							to="/register"
							className="text-green-600 hover:text-green-700 font-medium hover:underline"
						>
							S'inscrire
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
