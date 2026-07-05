// src/contexts/AuthContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { api, User, Profile } from "../lib/api";

interface AuthContextType {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	signUp: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		role: "producteur" | "prestataire",
		phoneNumber: string
	) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	updateProfile: (updates: Partial<Profile>) => Promise<void>;
	refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				const storedUser = localStorage.getItem("user");

				if (token && storedUser) {
					const userData: User = JSON.parse(storedUser);
					setUser({ ...userData, token });

					setProfile({
						id: userData.id,
						userId: userData.id,
						email: userData.email,
						fullName: `${userData.firstName} ${userData.lastName}`,
						phoneNumber: userData.phoneNumber,
						role: userData.role,
						createdAt: userData.createdAt,
						updatedAt: userData.updatedAt,
					});
				}
			} catch (error) {
				console.error("Error initializing auth:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();
	}, []);

	const signUp = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		role: "producteur" | "prestataire",
		phoneNumber: string
	) => {
		try {
			const response = await api.post("/auth/register", {
				firstName,
				lastName,
				email,
				password,
				role,
				phoneNumber,
			});

			// Inscription réussie, mais en attente de vérification OTP
			// On ne connecte pas l'utilisateur tout de suite
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de l'inscription"
			);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			const { token, user: userData } = response.data.data;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));

			setUser({ ...userData, token });
			setProfile({
				id: userData.id,
				userId: userData.id,
				email: userData.email,
				fullName: `${userData.firstName} ${userData.lastName}`,
				phoneNumber: userData.phoneNumber,
				role: userData.role,
				createdAt: userData.createdAt,
			});
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de la connexion"
			);
		}
	};

	const signOut = async () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setProfile(null);
	};

	const updateProfile = async (updates: Partial<Profile>) => {
		if (!user) throw new Error("No user logged in");
		try {
			const response = await api.put("/auth/profile", updates);
			const userData: User = response.data.data;

			const token = localStorage.getItem("token");
			setUser({ ...userData, token: token || undefined });
			localStorage.setItem("user", JSON.stringify(userData));

			setProfile({
				id: userData.id,
				userId: userData.id,
				email: userData.email,
				fullName: `${userData.firstName} ${userData.lastName}`,
				phoneNumber: userData.phoneNumber,
				role: userData.role,
				createdAt: userData.createdAt,
			});
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Erreur lors de la mise à jour"
			);
		}
	};

	const refreshProfile = async () => {
		try {
			const response = await api.get("/auth/profile");
			const userData: User = response.data.data;

			const token = localStorage.getItem("token");
			setUser({ ...userData, token: token || undefined });
			localStorage.setItem("user", JSON.stringify(userData));

			setProfile({
				id: userData.id,
				userId: userData.id,
				email: userData.email,
				fullName: `${userData.firstName} ${userData.lastName}`,
				phoneNumber: userData.phoneNumber,
				role: userData.role,
				createdAt: userData.createdAt,
			});
		} catch (error: any) {
			console.error("Error refreshing profile:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				profile,
				loading,
				signUp,
				signIn,
				signOut,
				updateProfile,
				refreshProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
