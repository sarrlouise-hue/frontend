import React, { useEffect, useState } from "react";
import { servicesService } from "../../services/servicesService";
import { Service } from "../../lib/api";
import { Tractor } from "lucide-react";
import { ServiceCard } from "../../components/Services/List/ServiceCard";
import { ServiceSearchFilters } from "../../components/Services/List/ServiceSearchFilters";

export const Services: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [filteredServices, setFilteredServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);

	const [filters, setFilters] = useState({
		search: "",
		serviceType: "",
		location: "",
		minPrice: "",
		maxPrice: "",
	});

	const [serviceTypes, setServiceTypes] = useState<string[]>([]);

	useEffect(() => {
		loadServices();
		loadFiltersData();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [filters, services]);

	const loadServices = async () => {
		try {
			// Removing availability filter to see all services for debugging
			const data = await servicesService.getServices({});
			console.log("Services fetched:", data);
			setServices(data);
			setFilteredServices(data);
		} catch (error) {
			console.error("Error loading services:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadFiltersData = async () => {
		try {
			const categoriesData = await servicesService.getCategories();
			setServiceTypes(categoriesData);
		} catch (error) {
			console.error("Error loading filter data:", error);
		}
	};

	const applyFilters = () => {
		let filtered = [...services];

		if (filters.search) {
			const search = filters.search.toLowerCase();
			filtered = filtered.filter(
				(s) =>
					s.name.toLowerCase().includes(search) ||
					s.description.toLowerCase().includes(search)
			);
		}

		if (filters.serviceType) {
			filtered = filtered.filter((s) => s.serviceType === filters.serviceType);
		}

		if (filters.minPrice) {
			filtered = filtered.filter(
				(s) => (s.pricePerDay || 0) >= parseFloat(filters.minPrice)
			);
		}

		if (filters.maxPrice) {
			filtered = filtered.filter(
				(s) => (s.pricePerDay || 0) <= parseFloat(filters.maxPrice)
			);
		}

		setFilteredServices(filtered);
	};

	const handleFilterChange = (key: string, value: string) => {
		setFilters({ ...filters, [key]: value });
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			serviceType: "",
			location: "",
			minPrice: "",
			maxPrice: "",
		});
	};

	const hasActiveFilters = Object.values(filters).some((value) => value !== "");

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Services disponibles
					</h1>
					<p className="text-gray-600">
						Trouvez les équipements et services agricoles adaptés à vos besoins
					</p>
				</div>

				<ServiceSearchFilters
					filters={filters}
					onFilterChange={handleFilterChange}
					onClearFilters={clearFilters}
					showFilters={showFilters}
					setShowFilters={setShowFilters}
					serviceTypes={serviceTypes}
				/>

				<div className="mb-4 text-gray-600">
					{filteredServices.length} service
					{filteredServices.length > 1 ? "s" : ""} trouvé
					{filteredServices.length > 1 ? "s" : ""}
				</div>

				{loading ? (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
					</div>
				) : filteredServices.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-12 text-center">
						<Tractor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Aucun service trouvé
						</h3>
						<p className="text-gray-600 mb-6">
							Essayez de modifier vos critères de recherche
						</p>
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
							>
								Réinitialiser les filtres
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredServices.map((service) => (
							<ServiceCard key={service.id} service={service} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};
