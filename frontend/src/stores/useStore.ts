import { create } from 'zustand';
import { VarianteProducto } from '../types';
import api from '../services/api';

interface AppState {
    alertas: VarianteProducto[];
    fetchAlertas: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    alertas: [],
    fetchAlertas: async () => {
        try {
            const response = await api.get<VarianteProducto[]>('/stock/alertas');
            set({ alertas: response.data });
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    },
}));
