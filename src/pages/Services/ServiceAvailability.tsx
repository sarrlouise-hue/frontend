import { useEffect, useState } from "react";
import { useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import MachineAvailabilityManager from "../../components/Services/ServiceAvailabilityManager";
import { servicesService } from "../../services/servicesService";
import { ArrowLeft, Loader } from "lucide-react";

interface Machine {
	id: string;
	name: string;
	type: string;
	is_active: boolean;
	availability?: {
		status: string;
	};
}

export const ServiceAvailability = () => {
	const { user, profile } = useAuth();
	const { navigate } = useRouter();
	const [machine, setMachine] = useState<Machine | null>(null);
	const [loading, setLoading] = useState(true);

	const pathParts = window.location.pathname.split("/");
	const machineId = pathParts[pathParts.length - 1];

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}
		if (machineId) {
			loadMachine();
		}
	}, [user, machineId]);

	const loadMachine = async () => {
		try {
			const data = await servicesService.getServiceById(machineId);
			setMachine(data as any);
		} catch (error) {
			console.error("Error loading machine:", error);
			navigate("/dashboard");
		} finally {
			setLoading(false);
		}
	};

	if (loading)
		return (
			<div className="text-center p-20">
				<Loader className="animate-spin mx-auto w-10 h-10" />
			</div>
		);
	if (!machine) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 mb-6"
				>
					<ArrowLeft /> Retour
				</button>
				<MachineAvailabilityManager
					machineId={machine.id}
					machineName={machine.name}
					currentStatus={machine.availability?.status === "available"}
				/>
			</div>
		</div>
	);
};
