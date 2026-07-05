import React, { useEffect } from "react";
import { useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";

export const Dashboard: React.FC = () => {
	const { user, loading } = useAuth();
	const { navigate } = useRouter();

	useEffect(() => {
		if (loading) return;

		if (!user) {
			navigate("/login");
			return;
		}

		if (user.role === "prestataire" || user.role === "provider") {
			navigate("/dashboard/prestataire");
		} else if (user.role === "producteur" || user.role === "user") {
			navigate("/dashboard/producteur");
		} else {
			navigate("/");
		}
	}, [user, loading, navigate]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
		</div>
	);
};
