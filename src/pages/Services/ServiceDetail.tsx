import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { servicesService } from "../../services/servicesService";
import { ChevronLeft } from "lucide-react";
import { Service } from "../../lib/api";
import { ServiceGallery } from "../../components/Services/Detail/ServiceGallery";
import { ServiceInfo } from "../../components/Services/Detail/ServiceInfo";
import { BookingSidebar } from "../../components/Services/Detail/BookingSidebar";

export const ServiceDetail: React.FC = () => {
	const { user, profile } = useAuth();
	const { navigate, currentPath } = useRouter();
	const serviceId = currentPath.split("/").pop() || "";

	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadService();
	}, [serviceId]);

	const loadService = async () => {
		try {
			const data = await servicesService.getServiceById(serviceId);
			if (!data) {
				navigate("/services");
				return;
			}
			setService(data);
		} catch (err) {
			console.error("Error loading service:", err);
			navigate("/services");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	if (!service) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<Link
					to="/services"
					className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
				>
					<ChevronLeft className="w-5 h-5" />
					<span>Retour aux services</span>
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<ServiceGallery images={service.images || []} name={service.name} />
						<ServiceInfo service={service} />
					</div>

					<div className="lg:col-span-1">
						<BookingSidebar service={service} user={user} profile={profile} />
					</div>
				</div>
			</div>
		</div>
	);
};
