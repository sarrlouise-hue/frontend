import React, { useState, useEffect } from "react";
import { useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { Tractor, Upload, X, AlertCircle, Loader } from "lucide-react";

export const CreateService: React.FC = () => {
	const { user, profile, loading } = useAuth();
	const { navigate } = useRouter();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		serviceType: "",
		pricePerDay: "",
		pricePerHour: "",
		brand: "",
		model: "",
		year: "",
		location: "",
		condition: "",
		availability: true,
	});

	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const serviceTypes = [
		{ value: "tractor", label: "Tracteur" },
		{ value: "semoir", label: "Semoir" },
		{ value: "operator", label: "Main d'œuvre" },
		{ value: "other", label: "Autre" },
	];

	useEffect(() => {
		if (loading) return;
		if (!user) navigate("/login");
		else if (
			profile?.role !== "prestataire" &&
			user?.role !== "admin" &&
			user?.role !== "provider"
		)
			navigate("/dashboard");
	}, [user, profile, loading]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		const val =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
		setFormData({ ...formData, [name]: val });
		setError("");
	};

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		const validFiles = files.filter((f) => f.type.startsWith("image/"));
		if (validFiles.length !== files.length) {
			setError("Seuls les fichiers images sont acceptés");
			return;
		}

		if (images.length + validFiles.length > 5) {
			setError("Vous ne pouvez ajouter que 5 images maximum");
			return;
		}

		const previews: string[] = [];
		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				previews.push(reader.result as string);
				if (previews.length === validFiles.length) {
					setImagePreviews([...imagePreviews, ...previews]);
				}
			};
			reader.readAsDataURL(file);
		});

		setImages([...images, ...validFiles]);
	};

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
		setImagePreviews(imagePreviews.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!formData.name || !formData.description || !formData.serviceType) {
			setError("Veuillez remplir tous les champs obligatoires");
			return;
		}

		setSubmitting(true);

		try {
			const data = new FormData();
			data.append("name", formData.name);
			data.append("serviceType", formData.serviceType);
			data.append("description", formData.description);
			if (formData.pricePerDay)
				data.append("pricePerDay", formData.pricePerDay);
			if (formData.pricePerHour)
				data.append("pricePerHour", formData.pricePerHour);
			if (formData.brand) data.append("brand", formData.brand);
			if (formData.model) data.append("model", formData.model);
			if (formData.year) data.append("year", formData.year);
			if (formData.location) data.append("location", formData.location);
			if (formData.condition) data.append("condition", formData.condition);
			data.append("availability", String(formData.availability));

			images.forEach((image) => data.append("images", image));

			await api.post("/services", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			navigate("/services");
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Erreur lors de la création du service"
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="bg-white rounded-lg shadow-md p-8">
					<h1 className="text-3xl font-bold mb-6 text-gray-900">
						Ajouter un service
					</h1>
					{error && (
						<div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
							<AlertCircle className="w-5 h-5" />
							<span>{error}</span>
						</div>
					)}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium mb-1">
									Nom du service
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Type de service
								</label>
								<select
									name="serviceType"
									value={formData.serviceType}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									required
								>
									<option value="">Choisir...</option>
									{serviceTypes.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium mb-1">
									Marque (optionnel)
								</label>
								<input
									type="text"
									name="brand"
									value={formData.brand}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="Ex: John Deere"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Modèle (optionnel)
								</label>
								<input
									type="text"
									name="model"
									value={formData.model}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="Ex: 6M 110"
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium mb-1">
									Année (optionnel)
								</label>
								<input
									type="number"
									name="year"
									value={formData.year}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="Ex: 2020"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Localisation (optionnel)
								</label>
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="Ex: Dakar, Thiès..."
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium mb-1">
									État (optionnel)
								</label>
								<input
									type="text"
									name="condition"
									value={formData.condition}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="Ex: Bon état, Neuf..."
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium mb-1">
									Prix par jour (FCFA)
								</label>
								<input
									type="number"
									name="pricePerDay"
									value={formData.pricePerDay}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="0"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Prix par heure (FCFA)
								</label>
								<input
									type="number"
									name="pricePerHour"
									value={formData.pricePerHour}
									onChange={handleInputChange}
									className="w-full p-3 border rounded-lg"
									placeholder="0"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={4}
								className="w-full p-3 border rounded-lg"
								required
								placeholder="Décrivez votre service..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Images (Max 5)
							</label>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
								<input
									type="file"
									id="images"
									multiple
									accept="image/*"
									onChange={handleImageSelect}
									className="hidden"
								/>
								<label
									htmlFor="images"
									className="cursor-pointer flex flex-col items-center gap-2"
								>
									<Upload className="w-8 h-8 text-gray-400" />
									<span className="text-gray-600">
										Cliquez pour ajouter des images
									</span>
								</label>
							</div>
							{imagePreviews.length > 0 && (
								<div className="mt-4 grid grid-cols-5 gap-4">
									{imagePreviews.map((preview, index) => (
										<div key={index} className="relative aspect-square">
											<img
												src={preview}
												alt={`Aperçu ${index + 1}`}
												className="w-full h-full object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
						>
							{submitting ? "Création..." : "Publier"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
