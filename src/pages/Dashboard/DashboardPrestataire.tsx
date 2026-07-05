import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { Plus } from "lucide-react";
import PrestataireManageServices from "../../components/Dashboard/Prestataire/PrestataireManageServices";
import PrestataireManageBookings from "../../components/Dashboard/Prestataire/PrestataireManageBookings";
import ProfileEditor from "../../components/Common/ProfileEditor";
import { PrestataireStatsView } from "../../components/Dashboard/Prestataire/PrestataireStatsView";

interface DashboardStats {
	overview: {
		totalServices: number;
		activeServices: number;
		totalBookings: number;
		activeBookings: number;
		pendingBookings: number;
		completedBookings: number;
		totalEarnings: number;
	};
}

export default function DashboardPrestataire() {
	const { user, profile, loading: authLoading } = useAuth();
	const { navigate } = useRouter();
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"stats" | "services" | "bookings" | "profile"
	>("stats");

	useEffect(() => {
		if (authLoading) return;
		if (!user) {
			navigate("/login");
			return;
		}
		if (
			profile?.role !== "prestataire" &&
			user?.role !== "admin" &&
			user?.role !== "provider"
		) {
			navigate("/dashboard");
			return;
		}
		fetchStats();
	}, [user, profile, authLoading]);

	const fetchStats = async () => {
		try {
			const response = await api.get("/providers/dashboard");
			setStats(response.data.data);
		} catch (error: any) {
			console.error("Erreur chargement stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading || authLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
					<p className="text-gray-600">
						Gestion de votre activité de prestataire
					</p>
				</div>

				<div className="mb-8 flex space-x-2 border-b border-gray-200 overflow-x-auto scrollbar-hide pb-px whitespace-nowrap">
					<button
						onClick={() => setActiveTab("stats")}
						className={`flex-shrink-0 pb-4 px-6 font-bold border-b-2 transition ${
							activeTab === "stats"
								? "border-green-600 text-green-600 text-lg"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`}
					>
						Vue d'ensemble
					</button>
					<button
						onClick={() => setActiveTab("services")}
						className={`flex-shrink-0 pb-4 px-6 font-bold border-b-2 transition ${
							activeTab === "services"
								? "border-green-600 text-green-600 text-lg"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`}
					>
						Services
					</button>
					<button
						onClick={() => setActiveTab("bookings")}
						className={`flex-shrink-0 pb-4 px-6 font-bold border-b-2 transition ${
							activeTab === "bookings"
								? "border-green-600 text-green-600 text-lg"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`}
					>
						Réservations
					</button>
					<button
						onClick={() => setActiveTab("profile")}
						className={`flex-shrink-0 pb-4 px-6 font-bold border-b-2 transition ${
							activeTab === "profile"
								? "border-green-600 text-green-600 text-lg"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`}
					>
						Profil
					</button>
				</div>

				{activeTab === "stats" && (
					<PrestataireStatsView
						stats={stats}
						user={user}
						onManageProfile={() => setActiveTab("profile")}
					/>
				)}

				{activeTab === "services" && <PrestataireManageServices />}

				{activeTab === "bookings" && <PrestataireManageBookings />}

				{activeTab === "profile" && <ProfileEditor />}
			</div>
		</div>
	);
}
