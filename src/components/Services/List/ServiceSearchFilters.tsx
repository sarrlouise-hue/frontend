import React from "react";
import { Search, Filter, X } from "lucide-react";

interface ServiceSearchFiltersProps {
	filters: {
		search: string;
		serviceType: string;
		location: string;
		minPrice: string;
		maxPrice: string;
	};
	onFilterChange: (key: string, value: string) => void;
	onClearFilters: () => void;
	showFilters: boolean;
	setShowFilters: (show: boolean) => void;
	serviceTypes: string[];
}

export const ServiceSearchFilters: React.FC<ServiceSearchFiltersProps> = ({
	filters,
	onFilterChange,
	onClearFilters,
	showFilters,
	setShowFilters,
	serviceTypes,
}) => {
	const hasActiveFilters = Object.entries(filters).some(
		([key, value]) => key !== "search" && value !== ""
	);

	const activeFiltersCount = Object.entries(filters).filter(
		([key, value]) => key !== "search" && value !== ""
	).length;

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1 relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-gray-400" />
					</div>
					<input
						type="text"
						placeholder="Rechercher un service..."
						value={filters.search}
						onChange={(e) => onFilterChange("search", e.target.value)}
						className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
					/>
				</div>

				<button
					onClick={() => setShowFilters(!showFilters)}
					className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<Filter className="w-5 h-5" />
					<span>Filtres</span>
					{activeFiltersCount > 0 && (
						<span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
							{activeFiltersCount}
						</span>
					)}
				</button>
			</div>

			{showFilters && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Type de service
							</label>
							<select
								value={filters.serviceType}
								onChange={(e) => onFilterChange("serviceType", e.target.value)}
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
							>
								<option value="">Tous les types</option>
								{serviceTypes.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Prix min (FCFA/jour)
							</label>
							<input
								type="number"
								placeholder="0"
								value={filters.minPrice}
								onChange={(e) => onFilterChange("minPrice", e.target.value)}
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Prix max (FCFA/jour)
							</label>
							<input
								type="number"
								placeholder="1000000"
								value={filters.maxPrice}
								onChange={(e) => onFilterChange("maxPrice", e.target.value)}
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
							/>
						</div>
					</div>

					{hasActiveFilters && (
						<div className="mt-4 flex justify-end">
							<button
								onClick={onClearFilters}
								className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
							>
								<X className="w-4 h-4" />
								<span>Effacer les filtres</span>
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
