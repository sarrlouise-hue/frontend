import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from "react";

interface LocationState {
	pathname: string;
	state?: any;
}

interface RouterContextType {
	location: LocationState;
	navigate: (path: string, state?: any) => void;
	params?: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = () => {
	const context = useContext(RouterContext);
	if (!context) {
		throw new Error("useRouter must be used within a Router");
	}
	// Return a destructurable object that includes location (with state)
	return {
		...context,
		currentPath: context.location.pathname, // Backward compatibility
	};
};

interface RouterProps {
	children: ReactNode;
}

export const Router: React.FC<RouterProps> = ({ children }) => {
	const [location, setLocation] = useState<LocationState>({
		pathname: window.location.pathname,
		state: window.history.state,
	});

	useEffect(() => {
		const handlePopState = () => {
			setLocation({
				pathname: window.location.pathname,
				state: window.history.state,
			});
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	const navigate = useCallback((path: string, state?: any) => {
		// Use the state passed in, or null
		const newState = state || null;
		window.history.pushState(newState, "", path);
		setLocation({
			pathname: path,
			state: newState,
		});
	}, []);

	const contextValue = React.useMemo(
		() => ({
			location,
			navigate,
		}),
		[location, navigate]
	);

	return (
		<RouterContext.Provider value={contextValue}>
			{children}
		</RouterContext.Provider>
	);
};

interface RouteProps {
	path: string;
	component: React.ComponentType;
}

export const Route: React.FC<RouteProps> = ({ path, component: Component }) => {
	const { location } = useRouter();

	// Extract route parameters
	// Note: Use location.pathname instead of currentPath
	const pathParts = path.split("/");
	const currentParts = location.pathname.split("/");

	if (pathParts.length !== currentParts.length) {
		return null;
	}

	const params: Record<string, string> = {};
	let matches = true;

	for (let i = 0; i < pathParts.length; i++) {
		if (pathParts[i].startsWith(":")) {
			const paramName = pathParts[i].slice(1);
			params[paramName] = currentParts[i];
		} else if (pathParts[i] !== currentParts[i]) {
			matches = false;
			break;
		}
	}

	if (!matches) {
		return null;
	}

	return <Component />;
};

interface LinkProps
	extends Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		"href" | "onClick"
	> {
	to: string;
	children: ReactNode;
	onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({
	to,
	children,
	className,
	onClick,
	...rest
}) => {
	const { navigate } = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		navigate(to);
		if (onClick) onClick();
	};

	return (
		<a href={to} onClick={handleClick} className={className} {...rest}>
			{children}
		</a>
	);
};

// Hook to get URL parameters
export const useParams = (): Record<string, string> => {
	// This is a simple implementation. In production, you'd want something more robust
	return {};
};
