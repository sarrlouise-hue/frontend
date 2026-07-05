import React, { useState } from "react";
import { Link, useRouter } from "../../router";
import { api } from "../../lib/api";
import { Mail, ArrowLeft, Check } from "lucide-react";

export function ForgotPassword() {
	const { navigate } = useRouter();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await api.post("/auth/forgot-password", { email });
			setSuccess(true);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Une erreur est survenue";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
				<div className="max-w-md w-full">
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Check className="w-8 h-8 text-green-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Email envoyé !
						</h2>
						<p className="text-gray-600 mb-6">
							Un email de réinitialisation a été envoyé à{" "}
							<strong>{email}</strong>. Veuillez vérifier votre boîte de
							réception et suivre les instructions.
						</p>
						<Link
							to="/login"
							className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
						>
							Retour à la connexion
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<Link
						to="/login"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Retour
					</Link>

					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Mail className="w-8 h-8 text-green-600" />
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Mot de passe oublié ?
						</h1>
						<p className="text-gray-600">
							Entrez votre email et nous vous enverrons un lien pour
							réinitialiser votre mot de passe
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Adresse email
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
								placeholder="votre@email.com"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							{loading
								? "Envoi en cours..."
								: "Envoyer le lien de réinitialisation"}
						</button>
					</form>
				</div>

				<p className="mt-6 text-center text-sm text-gray-600">
					Vous vous souvenez de votre mot de passe ?{" "}
					<Link
						to="/login"
						className="text-green-600 hover:text-green-700 font-medium"
					>
						Se connecter
					</Link>
				</p>
			</div>
		</div>
	);
}
