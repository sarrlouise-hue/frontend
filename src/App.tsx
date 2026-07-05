import { Router, Route, useRouter } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { VerifyOtp } from "./pages/Auth/VerifyOtp";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import DashboardProducteur from "./pages/Dashboard/DashboardProducteur";
import DashboardPrestataire from "./pages/Dashboard/DashboardPrestataire";
import Profile from "./pages/Profile/Profile";
import { Services } from "./pages/Services/Services";
import { ServiceDetail } from "./pages/Services/ServiceDetail";
import { CreateService } from "./pages/Services/CreateService";
import { EditService } from "./pages/Services/EditService";
import { ServiceAvailability } from "./pages/Services/ServiceAvailability";
import { Payment } from "./pages/Payment/Payment";
import { PaymentSuccess } from "./pages/Payment/PaymentSuccess";
import { PaymentCancel } from "./pages/Payment/PaymentCancel";

function AppContent() {
	const { currentPath } = useRouter();
	const isAuthPage =
		currentPath === "/login" ||
		currentPath === "/register" ||
		currentPath === "/forgot-password";
	const isPaymentPage = currentPath.startsWith("/payment");

	return (
		<div className="min-h-screen flex flex-col">
			{!isAuthPage && <Header />}
			<main className="flex-grow">
				<Route path="/" component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/verify-otp" component={VerifyOtp} />
				<Route path="/forgot-password" component={ForgotPassword} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/dashboard/producteur" component={DashboardProducteur} />
				<Route path="/dashboard/prestataire" component={DashboardPrestataire} />
				<Route path="/profile" component={Profile} />
				<Route path="/services" component={Services} />
				<Route path="/create-service" component={CreateService} />
				<Route path="/edit-service/:id" component={EditService} />
				<Route path="/payment" component={Payment} />
				<Route path="/payment-success" component={PaymentSuccess} />
				<Route path="/payment-cancel" component={PaymentCancel} />
				{currentPath.startsWith("/services/") &&
					!currentPath.includes("/availability") &&
					currentPath !== "/services" && <ServiceDetail />}
				{currentPath.startsWith("/services/") &&
					currentPath.includes("/availability") && <ServiceAvailability />}
			</main>
			{!isAuthPage && !isPaymentPage && <Footer />}
		</div>
	);
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</Router>
	);
}

export default App;
