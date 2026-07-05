import { api, Reservation } from '../lib/api';

export interface PriceCalculation {
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalPrice: number;
}

export const reservationsService = {
  calculatePrice(startDate: string, endDate: string, pricePerDay: number): PriceCalculation {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const subtotal = totalDays * pricePerDay;

    let discountPercentage = 0;
    if (totalDays >= 30) discountPercentage = 20;
    else if (totalDays >= 14) discountPercentage = 15;
    else if (totalDays >= 7) discountPercentage = 10;

    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalPrice = subtotal - discountAmount;

    return { totalDays, pricePerDay, subtotal, discountPercentage, discountAmount, totalPrice };
  },

  async createReservation(reservationData: {
    machine_id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    price_per_day: number;
    notes?: string;
  }): Promise<Reservation> {
    try {
      const response = await api.post<{ success: boolean; reservation: Reservation }>('/reservations', {
        machineId: reservationData.machine_id,
        startDate: reservationData.start_date,
        endDate: reservationData.end_date,
        deliveryAddress: {
          address: '',
          city: '',
          region: ''
        },
        notes: reservationData.notes || '',
      });
      return response.data.reservation;
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la réservation';
      throw new Error(errorMessage);
    }
  },

  async getReservationsByUserId(userId: string): Promise<Reservation[]> {
    try {
      const response = await api.get<{ data: Reservation[] }>('/reservations', {
        params: { userId },
      });
      return response.data.data ?? [];
    } catch (error: unknown) {
      console.error('Error fetching user reservations:', error);
      throw new Error('Failed to fetch user reservations');
    }
  },

  async getReservationsForOwner(ownerId: string): Promise<Reservation[]> {
    try {
      const response = await api.get<{ data: Reservation[] }>('/reservations', {
        params: { asOwner: true, ownerId },
      });
      return response.data.data ?? [];
    } catch (error: unknown) {
      console.error('Error fetching owner reservations:', error);
      throw new Error('Failed to fetch owner reservations');
    }
  },

  async getReservationById(id: string): Promise<Reservation | null> {
    try {
      const response = await api.get<{ data: Reservation }>(`/reservations/${id}`);
      return response.data.data ?? null;
    } catch (error: unknown) {
      console.error('Error fetching reservation:', error);
      throw new Error('Failed to fetch reservation');
    }
  },

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    try {
      const response = await api.put<{ data: Reservation }>(`/reservations/${id}`, { status });
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating reservation status:', error);
      throw new Error('Failed to update reservation status');
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: string, paymentMethod?: string): Promise<Reservation> {
    try {
      const updates: Partial<Reservation> = { status: paymentStatus };
      if (paymentMethod) updates['paymentMethod'] = paymentMethod as unknown as string;

      const response = await api.put<{ data: Reservation }>(`/reservations/${id}`, updates);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  },

  async cancelReservation(id: string): Promise<Reservation> {
    return this.updateReservationStatus(id, 'cancelled');
  },

  async checkAvailability(machineId: string, startDate: string, endDate: string, excludeReservationId?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (excludeReservationId) params.append('excludeReservationId', excludeReservationId);

      const response = await api.get<{ data?: { available: boolean } }>(`/machines/${machineId}/availability?${params.toString()}`);
      return response.data?.data?.available ?? false;
    } catch (error: unknown) {
      console.error('Error checking availability:', error);
      return false;
    }
  },

  async getReservationStats(ownerId: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    try {
      const reservations = await this.getReservationsForOwner(ownerId);

      return reservations.reduce(
        (stats, r) => {
          stats.total++;
          if (r.status === 'pending') stats.pending++;
          else if (r.status === 'confirmed') stats.confirmed++;
          else if (r.status === 'completed') {
            stats.completed++;
            stats.totalRevenue += r.total;
          } else if (r.status === 'cancelled') stats.cancelled++;
          return stats;
        },
        { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, totalRevenue: 0 }
      );
    } catch (error: unknown) {
      console.error('Error fetching reservation stats:', error);
      throw new Error('Failed to fetch reservation stats');
    }
  },
};
