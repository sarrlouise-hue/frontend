import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import availabilityService, {
	AvailabilityStats,
} from "../../services/availabilityService";
import AvailabilityCalendar from "./AvailabilityCalendar";

interface MachineAvailabilityManagerProps {
	machineId: string;
	machineName: string;
	currentStatus?: boolean;
}

interface BlockedPeriod {
	startDate: string;
	endDate: string;
	reason: string;
}

const MachineAvailabilityManager = ({
	machineId,
	machineName,
	currentStatus = true,
}: MachineAvailabilityManagerProps) => {
	const { user } = useAuth();
	const [isAvailable, setIsAvailable] = useState(currentStatus);
	const [stats, setStats] = useState<AvailabilityStats | null>(null);
	const [loading, setLoading] = useState(false);
	const [showBlockForm, setShowBlockForm] = useState(false);
	const [blockForm, setBlockForm] = useState<BlockedPeriod>({
		startDate: "",
		endDate: "",
		reason: "",
	});
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		loadStats();
	}, [machineId]);

	const loadStats = async () => {
		if (!user?.token) return;

		try {
			const data = await availabilityService.getStats(machineId, user.token);
			setStats(data);
		} catch (error) {
			console.error("Error loading stats:", error);
		}
	};

	const handleToggleAvailability = async () => {
		if (!user?.token) return;

		setLoading(true);
		setMessage(null);

		try {
			await availabilityService.updateAvailabilityStatus(
				machineId,
				!isAvailable,
				user.token
			);

			setIsAvailable(!isAvailable);
			setMessage({
				type: "success",
				text: `Machine ${!isAvailable ? "activée" : "désactivée"} avec succès`,
			});
		} catch (error: any) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Erreur lors de la mise à jour",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleBlockPeriod = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.token) return;

		if (!blockForm.startDate || !blockForm.endDate) {
			setMessage({ type: "error", text: "Veuillez sélectionner les dates" });
			return;
		}

		if (new Date(blockForm.startDate) >= new Date(blockForm.endDate)) {
			setMessage({
				type: "error",
				text: "La date de fin doit être après la date de début",
			});
			return;
		}

		setLoading(true);
		setMessage(null);

		try {
			await availabilityService.blockPeriod(
				machineId,
				blockForm.startDate,
				blockForm.endDate,
				blockForm.reason || "Période bloquée",
				user.token
			);

			setMessage({
				type: "success",
				text: "Période bloquée avec succès",
			});

			setBlockForm({ startDate: "", endDate: "", reason: "" });
			setShowBlockForm(false);

			setTimeout(() => window.location.reload(), 1500);
		} catch (error: any) {
			setMessage({
				type: "error",
				text:
					error.response?.data?.message ||
					"Erreur lors du blocage de la période",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.type === "success"
							? "bg-green-50 text-green-800 border border-green-200"
							: "bg-red-50 text-red-800 border border-red-200"
					}`}
				>
					{message.text}
				</div>
			)}

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-xl font-bold text-gray-900">{machineName}</h3>
						<p className="text-sm text-gray-600 mt-1">
							Gestion de la disponibilité
						</p>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-gray-700">
							{isAvailable ? "Disponible" : "Indisponible"}
						</span>
						<button
							onClick={handleToggleAvailability}
							disabled={loading}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								isAvailable ? "bg-green-600" : "bg-gray-300"
							} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									isAvailable ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>

				{stats && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-blue-50 rounded-lg p-4">
							<p className="text-sm text-blue-600 font-medium">
								Total réservations
							</p>
							<p className="text-2xl font-bold text-blue-900 mt-1">
								{stats.totalReservations}
							</p>
						</div>

						<div className="bg-green-50 rounded-lg p-4">
							<p className="text-sm text-green-600 font-medium">Confirmées</p>
							<p className="text-2xl font-bold text-green-900 mt-1">
								{stats.confirmedReservations}
							</p>
						</div>

						<div className="bg-purple-50 rounded-lg p-4">
							<p className="text-sm text-purple-600 font-medium">À venir</p>
							<p className="text-2xl font-bold text-purple-900 mt-1">
								{stats.upcomingReservations}
							</p>
						</div>

						<div className="bg-orange-50 rounded-lg p-4">
							<p className="text-sm text-orange-600 font-medium">
								Taux occupation
							</p>
							<p className="text-2xl font-bold text-orange-900 mt-1">
								{stats.occupancyRate}%
							</p>
						</div>
					</div>
				)}

				<div className="border-t pt-4">
					<button
						onClick={() => setShowBlockForm(!showBlockForm)}
						className="w-full md:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
					>
						{showBlockForm ? "Annuler" : "Bloquer une période"}
					</button>
				</div>
			</div>

			{showBlockForm && (
				<div className="bg-white rounded-lg shadow p-6">
					<h4 className="text-lg font-bold text-gray-900 mb-4">
						Bloquer une période
					</h4>
					<p className="text-sm text-gray-600 mb-6">
						Pendant cette période, la machine ne pourra pas être réservée
						(maintenance, réparation, etc.)
					</p>

					<form onSubmit={handleBlockPeriod} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Date de début
								</label>
								<input
									type="date"
									value={blockForm.startDate}
									onChange={(e) =>
										setBlockForm({ ...blockForm, startDate: e.target.value })
									}
									min={new Date().toISOString().split("T")[0]}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Date de fin
								</label>
								<input
									type="date"
									value={blockForm.endDate}
									onChange={(e) =>
										setBlockForm({ ...blockForm, endDate: e.target.value })
									}
									min={
										blockForm.startDate ||
										new Date().toISOString().split("T")[0]
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Raison (optionnel)
							</label>
							<textarea
								value={blockForm.reason}
								onChange={(e) =>
									setBlockForm({ ...blockForm, reason: e.target.value })
								}
								rows={3}
								placeholder="Ex: Maintenance préventive, Réparation, Usage personnel..."
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
							/>
						</div>

						<div className="flex gap-3">
							<button
								type="submit"
								disabled={loading}
								className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
							>
								{loading ? "Enregistrement..." : "Bloquer la période"}
							</button>
							<button
								type="button"
								onClick={() => setShowBlockForm(false)}
								className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="bg-white rounded-lg shadow p-6">
				<h4 className="text-lg font-bold text-gray-900 mb-4">
					Calendrier des réservations
				</h4>
				<AvailabilityCalendar machineId={machineId} />
			</div>
		</div>
	);
};

export default MachineAvailabilityManager;
