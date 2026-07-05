import React, { useEffect, useState } from "react";
import { servicesService } from "../services/servicesService";
import { Service } from "../lib/api";
import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";
import { HowItWorks } from "../components/Home/HowItWorks";
import { AvailableServices } from "../components/Home/AvailableServices";
import { ProvidersList } from "../components/Home/ProvidersList";
import { CTA } from "../components/Home/CTA";

export const Home: React.FC = () => {
	const [recentServices, setRecentServices] = useState<Service[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const services = await servicesService.getServices({
					availability: true,
				});
				setTotalCount(services.length);
				setRecentServices(services.slice(0, 4));
			} catch (error) {
				console.error("Error fetching services for home page:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchServices();
	}, []);

	return (
		<div className="min-h-screen">
			<Hero totalCount={totalCount} />
			<Features />
			<HowItWorks />
			<AvailableServices loading={loading} recentServices={recentServices} />
			<ProvidersList />
			<CTA />
		</div>
	);
};
