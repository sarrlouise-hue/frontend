import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { Tractor, Mail, AlertCircle, KeyRound, ArrowRight } from "lucide-react";

export const VerifyOtp: React.FC = () => {
	const { navigate, location } = useRouter();
	// Handle both direct state passing and React Router style { state: { ... } } passing
	const locationState = location.state as any;
	const email = locationState?.email || locationState?.state?.email;
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);

	useEffect(() => {
		if (!email) {
			navigate("/login");
		}
	}, [email, navigate]);

	if (!email) {
		return null;
	}

	const handleChange = (element: HTMLInputElement, index: number) => {
		if (isNaN(Number(element.value))) return false;

		setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

		// Focus next input
		if (element.nextSibling && element.value !== "") {
			(element.nextSibling as HTMLInputElement).focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
		if (pastedData.every((char) => !isNaN(Number(char)))) {
			const newOtp = [...otp];
			pastedData.forEach((char, index) => {
				if (index < 6) newOtp[index] = char;
			});
			setOtp(newOtp);
			// Focus last filled input or verify button
			const nextFocusIndex = Math.min(pastedData.length, 5);
			const inputElements = document.querySelectorAll("input[name^='otp-']");
			if (inputElements[nextFocusIndex]) {
				(inputElements[nextFocusIndex] as HTMLInputElement).focus();
			}
		}
	};

	const handleResendOtp = async () => {
		setResending(true);
		setError("");
		setSuccess("");
		try {
			await api.post("/auth/resend-otp", { email });
			setSuccess("Un nouveau code a été envoyé à votre adresse email.");
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Erreur lors de l'envoi du code."
			);
		} finally {
			setResending(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const code = otp.join("");
		if (code.length !== 6) {
			setError("Veuillez entrer le code complet à 6 chiffres.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Actually calling the verify endpoint.
			// Note: In a real app we might want to use a context method if it updates global auth state.
			// But verifyOTP in backend returns tokens, so we can login with them.
			const response = await api.post("/auth/verify-otp", { email, code });

			const { token, user } = response.data.data;

			// Manually set session or use a helper if available.
			// Since AuthContext exposes signIn/signUp but maybe not a direct "setSession", we do it manually or add a method.
			// For now, let's duplicate what AuthContext does, or better, add a method verifyAccount in context.
			// But to be quick, we set localStorage and redirect. AuthProvider will pick it up on refresh or we force a reload.
			// Actually, better to reload to ensure context sync.

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			// Force reload to update context or just navigate if context listens to storage (it usually doesn't).
			// So we really should have a context method. But a hard reload works for MVP.
			window.location.href = "/dashboard";
		} catch (err: any) {
			setError(err.response?.data?.message || "Code incorrect ou expiré.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-[420px] w-full">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-2 mb-6">
						<Tractor className="w-8 h-8 text-green-600" strokeWidth={2.5} />
						<span className="text-2xl font-bold text-gray-900">
							AlloTracteur
						</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Vérification
					</h2>
					<p className="text-gray-500 text-sm">
						Entrez le code à 6 chiffres envoyé à <br />
						<span className="font-medium text-gray-900">{email}</span>
					</p>
				</div>

				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
						<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
						<p className="text-red-800 text-sm font-medium">{error}</p>
					</div>
				)}

				{success && (
					<div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-3">
						<AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
						<p className="text-green-800 text-sm font-medium">{success}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex justify-center gap-2">
						{otp.map((data, index) => (
							<input
								key={index}
								name={`otp-${index}`}
								type="text"
								maxLength={1}
								value={data}
								onChange={(e) => handleChange(e.target, index)}
								onPaste={handlePaste}
								onKeyDown={(e) => {
									if (e.key === "Backspace" && !otp[index] && index > 0) {
										const prev = document.querySelector(
											`input[name=otp-${index - 1}]`
										) as HTMLInputElement;
										if (prev) prev.focus();
									}
								}}
								className="w-12 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
							/>
						))}
					</div>

					<button
						type="submit"
						disabled={loading || otp.join("").length !== 6}
						className="w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 transition-all font-bold text-base shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							"Vérification..."
						) : (
							<>
								Vérifier mon compte <ArrowRight className="w-5 h-5" />
							</>
						)}
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={handleResendOtp}
							disabled={resending}
							className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
						>
							{resending ? "Envoi..." : "Renvoyer le code"}
						</button>
					</div>
				</form>

				<div className="mt-8 text-center">
					<Link
						to="/login"
						className="text-gray-500 hover:text-gray-900 text-sm"
					>
						← Retour à la connexion
					</Link>
				</div>
			</div>
		</div>
	);
};
