import { useEffect, useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { Search } from "lucide-react";
import ProducteurManageReservations from "../../components/Dashboard/Producteur/ProducteurManageReservations";
import ProfileEditor from "../../components/Common/ProfileEditor";
import { ProducteurStatsView } from "../../components/Dashboard/Producteur/ProducteurStatsView";

interface ProducteurStats {
	reservations: {
		total: number;
		enAttente: number;
		confirmees: number;
		enCours: number;
		terminees: number;
		annulees: number;
	};
	finances: {
		depensesTotales: number;
	};
}

export default function DashboardProducteur() {
	const { user, loading: authLoading } = useAuth();
	const { navigate } = useRouter();
	const [stats, setStats] = useState<ProducteurStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"stats" | "reservations" | "profile"
	>("stats");

	useEffect(() => {
		if (authLoading) return;
		if (!user || (user.role !== "producteur" && user.role !== "user")) {
			navigate("/dashboard");
			return;
		}
		fetchStats();
	}, [user, authLoading]);

	const fetchStats = async () => {
		try {
			const response = await api.get("/producteur/dashboard");
			setStats(response.data.data);
		} catch (error) {
			console.error("Erreur chargement stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading || authLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Dashboard Producteur
						</h1>
						<p className="text-gray-600 mt-2">
							Bienvenue, {user?.firstName} {user?.lastName}
						</p>
					</div>
					<Link
						to="/services"
						className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
					>
						<Search className="w-5 h-5" />
						<span>Chercher des machines</span>
					</Link>
				</div>

				<div className="mb-6 flex space-x-4 border-b border-gray-200 overflow-x-auto scrollbar-hide whitespace-nowrap">
					<button
						onClick={() => setActiveTab("stats")}
						className={`flex-shrink-0 pb-4 px-4 font-medium border-b-2 transition ${
							activeTab === "stats"
								? "border-green-600 text-green-600"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Statistiques
					</button>
					<button
						onClick={() => setActiveTab("reservations")}
						className={`flex-shrink-0 pb-4 px-4 font-medium border-b-2 transition ${
							activeTab === "reservations"
								? "border-green-600 text-green-600"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Mes Réservations
					</button>
					<button
						onClick={() => setActiveTab("profile")}
						className={`flex-shrink-0 pb-4 px-4 font-medium border-b-2 transition ${
							activeTab === "profile"
								? "border-green-600 text-green-600"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Mon Profil
					</button>
				</div>

				{activeTab === "stats" && <ProducteurStatsView stats={stats} />}

				{activeTab === "reservations" && <ProducteurManageReservations />}

				{activeTab === "profile" && <ProfileEditor />}
			</div>
		</div>
	);
}
