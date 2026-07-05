import { useState, useEffect } from "react";
import availabilityService, {
	CalendarData,
} from "../../services/availabilityService";

interface AvailabilityCalendarProps {
	machineId: string;
	onDateSelect?: (date: Date) => void;
	selectedStartDate?: Date | null;
	selectedEndDate?: Date | null;
}

const AvailabilityCalendar = ({
	machineId,
	onDateSelect,
	selectedStartDate,
	selectedEndDate,
}: AvailabilityCalendarProps) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
	const [loading, setLoading] = useState(true);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1;

	useEffect(() => {
		loadCalendarData();
	}, [machineId, year, month]);

	const loadCalendarData = async () => {
		try {
			setLoading(true);
			const data = await availabilityService.getCalendar(
				machineId,
				year,
				month
			);
			setCalendarData(data);
		} catch (error) {
			console.error("Error loading calendar:", error);
		} finally {
			setLoading(false);
		}
	};

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month, 0).getDate();
	};

	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month - 1, 1).getDay();
	};

	const isDateUnavailable = (date: Date) => {
		if (!calendarData) return false;
		const dateStr = date.toISOString().split("T")[0];
		return calendarData.unavailableDates.includes(dateStr);
	};

	const isDateSelected = (date: Date) => {
		if (!selectedStartDate) return false;

		const dateStr = date.toISOString().split("T")[0];
		const startStr = selectedStartDate.toISOString().split("T")[0];

		if (!selectedEndDate) {
			return dateStr === startStr;
		}

		const endStr = selectedEndDate.toISOString().split("T")[0];
		return dateStr >= startStr && dateStr <= endStr;
	};

	const isDateInPast = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	};

	const handleDateClick = (date: Date) => {
		if (isDateInPast(date) || isDateUnavailable(date)) return;
		if (onDateSelect) {
			onDateSelect(date);
		}
	};

	const previousMonth = () => {
		setCurrentDate(new Date(year, month - 2, 1));
	};

	const nextMonth = () => {
		setCurrentDate(new Date(year, month, 1));
	};

	const renderCalendar = () => {
		const daysInMonth = getDaysInMonth(year, month);
		const firstDay = getFirstDayOfMonth(year, month);
		const days = [];

		for (let i = 0; i < firstDay; i++) {
			days.push(<div key={`empty-${i}`} className="h-12" />);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month - 1, day);
			const unavailable = isDateUnavailable(date);
			const selected = isDateSelected(date);
			const past = isDateInPast(date);
			const disabled = past || unavailable;

			days.push(
				<button
					key={day}
					onClick={() => handleDateClick(date)}
					disabled={disabled}
					className={`
            h-12 rounded-lg flex items-center justify-center text-sm font-medium
            transition-all duration-200
            ${
							selected
								? "bg-green-600 text-white"
								: disabled
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: "bg-white hover:bg-green-50 text-gray-900"
						}
            ${unavailable && !past ? "bg-red-50 text-red-600" : ""}
            ${!disabled ? "cursor-pointer" : ""}
          `}
				>
					{day}
				</button>
			);
		}

		return days;
	};

	const monthNames = [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Octobre",
		"Novembre",
		"Décembre",
	];

	const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded mb-4" />
					<div className="grid grid-cols-7 gap-2">
						{[...Array(35)].map((_, i) => (
							<div key={i} className="h-12 bg-gray-200 rounded" />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={previousMonth}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<h3 className="text-lg font-semibold text-gray-900">
					{monthNames[month - 1]} {year}
				</h3>

				<button
					onClick={nextMonth}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<div className="grid grid-cols-7 gap-2 mb-2">
				{dayNames.map((day) => (
					<div
						key={day}
						className="text-center text-sm font-medium text-gray-600 py-2"
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

			<div className="mt-6 space-y-2">
				<div className="flex items-center gap-2 text-sm">
					<div className="w-4 h-4 bg-green-600 rounded" />
					<span className="text-gray-700">Sélectionné</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<div className="w-4 h-4 bg-red-50 border border-red-300 rounded" />
					<span className="text-gray-700">Non disponible</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<div className="w-4 h-4 bg-gray-100 rounded" />
					<span className="text-gray-700">Passé</span>
				</div>
			</div>

			{calendarData && calendarData.reservations.length > 0 && (
				<div className="mt-6 border-t pt-4">
					<h4 className="font-semibold text-gray-900 mb-3">
						Réservations ce mois ({calendarData.reservations.length})
					</h4>
					<div className="space-y-2 max-h-48 overflow-y-auto">
						{calendarData.reservations.map((reservation) => (
							<div
								key={reservation.id}
								className="p-3 bg-gray-50 rounded-lg text-sm"
							>
								<div className="flex justify-between items-start">
									<div>
										<p className="font-medium text-gray-900">
											{new Date(reservation.start_date).toLocaleDateString(
												"fr-FR"
											)}{" "}
											-{" "}
											{new Date(reservation.end_date).toLocaleDateString(
												"fr-FR"
											)}
										</p>
										{reservation.producteur && (
											<p className="text-gray-600 text-xs mt-1">
												{reservation.producteur.first_name}{" "}
												{reservation.producteur.last_name}
											</p>
										)}
									</div>
									<span
										className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${
												reservation.status === "confirmed"
													? "bg-green-100 text-green-800"
													: ""
											}
                      ${
												reservation.status === "pending"
													? "bg-yellow-100 text-yellow-800"
													: ""
											}
                      ${
												reservation.status === "in_progress"
													? "bg-blue-100 text-blue-800"
													: ""
											}
                    `}
									>
										{reservation.status === "confirmed" && "Confirmée"}
										{reservation.status === "pending" && "En attente"}
										{reservation.status === "in_progress" && "En cours"}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AvailabilityCalendar;
