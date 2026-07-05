import api from '../lib/api';

export interface AvailabilityCheck {
  available: boolean;
  numberOfDays: number;
  pricePerDay: number;
  totalPrice: number;
  message: string;
  conflictingReservations?: Array<{
    id: string;
    start_date: string;
    end_date: string;
    status: string;
  }>;
}

export interface CalendarData {
  year: number;
  month: number;
  reservations: Array<{
    id: string;
    start_date: string;
    end_date: string;
    status: string;
    producteur?: {
      first_name: string;
      last_name: string;
      phone: string;
    };
  }>;
  unavailableDates: string[];
}

export interface AvailabilityStats {
  totalReservations: number;
  totalDaysBooked: number;
  confirmedReservations: number;
  upcomingReservations: number;
  occupancyRate: number;
  period: string;
}

const availabilityService = {
  async checkAvailability(
    machineId: string,
    startDate: string,
    endDate: string
  ): Promise<AvailabilityCheck> {
    const response = await api.get(
      `/availability/check/${machineId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  async getCalendar(
    machineId: string,
    year?: number,
    month?: number
  ): Promise<CalendarData> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const response = await api.get(
      `/availability/calendar/${machineId}${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data;
  },

  async getUnavailableDates(
    machineId: string,
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    const response = await api.get(
      `/availability/unavailable-dates/${machineId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.unavailableDates;
  },

  async updateAvailabilityStatus(
    machineId: string,
    isAvailable: boolean,
    token: string
  ): Promise<any> {
    const response = await api.put(
      `/availability/status/${machineId}`,
      { isAvailable },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async blockPeriod(
    machineId: string,
    startDate: string,
    endDate: string,
    reason: string,
    token: string
  ): Promise<any> {
    const response = await api.post(
      `/availability/block-period/${machineId}`,
      { startDate, endDate, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async getStats(machineId: string, token: string): Promise<AvailabilityStats> {
    const response = await api.get(`/availability/stats/${machineId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.stats;
  }
};

export default availabilityService;
