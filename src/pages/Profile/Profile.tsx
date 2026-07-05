import React, { useEffect } from "react";
import { useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import ProfileEditor from "../../components/Common/ProfileEditor";
import { User, Settings, Shield, Bell } from "lucide-react";

const Profile: React.FC = () => {
	const { user, loading } = useAuth();
	const { navigate } = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			navigate("/login");
		}
	}, [user, loading, navigate]);

	if (loading || !user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-10">
					<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
						Paramètres du compte
					</h1>
					<p className="mt-2 text-gray-600">
						Gérez vos informations personnelles et vos préférences de sécurité
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar Navigation */}
					<div className="w-full lg:w-64 flex-shrink-0">
						<nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto scrollbar-hide bg-white p-4 rounded-2xl shadow-sm border border-gray-100 whitespace-nowrap lg:whitespace-normal">
							<button className="flex-shrink-0 lg:w-full flex items-center px-4 py-3 text-sm font-bold text-green-700 bg-green-50 rounded-xl transition-all">
								<User className="w-5 h-5 mr-3" />
								Mon profil
							</button>
							<button className="flex-shrink-0 lg:w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
								<Shield className="w-5 h-5 mr-3" />
								Sécurité
							</button>
							<button className="flex-shrink-0 lg:w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
								<Bell className="w-5 h-5 mr-3" />
								Notifications
							</button>
							<button className="flex-shrink-0 lg:w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
								<Settings className="w-5 h-5 mr-3" />
								Préférences
							</button>
						</nav>
					</div>

					{/* Main Content Area */}
					<div className="flex-grow">
						<ProfileEditor />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
