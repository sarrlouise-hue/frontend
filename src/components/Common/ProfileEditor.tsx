import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { User as UserIcon, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export const ProfileEditor: React.FC = () => {
	const { user, updateProfile } = useAuth();
	const [formData, setFormData] = useState({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
		phoneNumber: user?.phoneNumber || "",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [passwordMessage, setPasswordMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setMessage(null);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value,
		});
		setPasswordMessage(null);
	};

	const handleSubmitProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			await updateProfile(formData as any);
			setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
		} catch (error: any) {
			setMessage({
				type: "error",
				text: error.message || "Erreur lors de la mise à jour du profil",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordMessage(null);

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordMessage({
				type: "error",
				text: "Les mots de passe ne correspondent pas",
			});
			return;
		}

		setLoading(true);

		try {
			await api.put("/auth/password", {
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			});
			setPasswordMessage({
				type: "success",
				text: "Mot de passe modifié avec succès !",
			});
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: any) {
			setPasswordMessage({
				type: "error",
				text: error.response?.data?.message || "Erreur lors de la modification",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<h2 className="text-xl font-bold mb-8 flex items-center">
					<UserIcon className="w-6 h-6 mr-3 text-green-600" />
					Informations personnelles
				</h2>

				<form onSubmit={handleSubmitProfile} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-bold text-gray-700 mb-2">
								Prénom
							</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm font-bold text-gray-700 mb-2">
								Nom
							</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							disabled
							className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-gray-500 cursor-not-allowed outline-none"
						/>
					</div>

					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">
							Téléphone
						</label>
						<input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
						/>
					</div>

					{message && (
						<div
							className={`p-4 rounded-xl flex items-center ${
								message.type === "success"
									? "bg-green-50 text-green-700"
									: "bg-red-50 text-red-700"
							}`}
						>
							<AlertCircle className="w-5 h-5 mr-2" />
							<span className="text-sm font-bold">{message.text}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100"
					>
						{loading ? "Mise à jour..." : "Enregistrer les modifications"}
					</button>
				</form>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<h2 className="text-xl font-bold mb-8 flex items-center">
					<Lock className="w-6 h-6 mr-3 text-orange-600" />
					Sécurité
				</h2>

				<form onSubmit={handleSubmitPassword} className="space-y-6">
					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">
							Mot de passe actuel
						</label>
						<div className="relative">
							<input
								type={showCurrentPassword ? "text" : "password"}
								name="currentPassword"
								value={passwordData.currentPassword}
								onChange={handlePasswordChange}
								className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showCurrentPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">
							Nouveau mot de passe
						</label>
						<div className="relative">
							<input
								type={showNewPassword ? "text" : "password"}
								name="newPassword"
								value={passwordData.newPassword}
								onChange={handlePasswordChange}
								className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showNewPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">
							Confirmer le nouveau
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								name="confirmPassword"
								value={passwordData.confirmPassword}
								onChange={handlePasswordChange}
								className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showConfirmPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					{passwordMessage && (
						<div
							className={`p-4 rounded-xl flex items-center ${
								passwordMessage.type === "success"
									? "bg-green-50 text-green-700"
									: "bg-red-50 text-red-700"
							}`}
						>
							<AlertCircle className="w-5 h-5 mr-2" />
							<span className="text-sm font-bold">{passwordMessage.text}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-black transition-all font-bold"
					>
						{loading ? "Traitement..." : "Modifier le mot de passe"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ProfileEditor;
