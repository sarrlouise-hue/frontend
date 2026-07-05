export type ServiceType = "tractor" | "semoir" | "operator" | "other";

export interface Profile {
	id: string;
	userId: string;
	email: string;
	fullName: string;
	phoneNumber?: string;
	role: "producteur" | "prestataire" | "admin" | "user" | "provider";
	address?: string;
	avatarUrl?: string;
	bio?: string;
	businessName?: string;
	user?: User;
	createdAt: string;
	updatedAt?: string;
}

export interface Service {
	id: string;
	providerId: string;
	name: string;
	description: string;
	serviceType: ServiceType;
	pricePerHour?: number;
	pricePerDay?: number;
	images: string[];
	availability: boolean;
	latitude?: number;
	longitude?: number;
	createdAt: string;
	updatedAt: string;
	provider?: Profile;
	brand?: string;
	model?: string;
	year?: number | string;
	condition?: string;
	location?: string;
	technicalSpecifications?: Record<string, any>;
}

export interface Booking {
	id: string;
	serviceId: string;
	userId: string;
	providerId: string;
	type: "daily" | "hourly";
	startDate: string;
	endDate: string;
	bookingDate?: string;
	startTime?: string;
	duration?: number;
	status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
	totalPrice: number;
	notes?: string;
	paymentStatus?: string;
	paymentMethod?: string;
	createdAt: string;
	updatedAt: string;
	service?: Service;
	user?: User;
}

export interface Payment {
	id: string;
	bookingId: string;
	userId: string;
	amount: number;
	paymentMethod: string;
	status: "pending" | "success" | "failed";
	transactionId?: string;
	paymentDate?: string;
	metadata?: any;
	createdAt: string;
	updatedAt: string;
}

export interface Review {
	id: string;
	serviceId: string;
	userId: string;
	bookingId: string;
	rating: number;
	comment?: string;
	createdAt: string;
	updatedAt: string;
	user?: Profile;
}

export interface Notification {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	read: boolean;
	relatedId?: string;
	relatedType?: string;
	createdAt: string;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	role: "producteur" | "prestataire" | "admin" | "user" | "provider";
	isVerified: boolean;
	token?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface DashboardStats {
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
