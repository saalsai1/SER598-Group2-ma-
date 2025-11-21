import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  shippingAddress?: string;
  paymentMethod?: string;
}

interface OrderHistoryState {
  orders: Order[];
}

const loadOrdersFromStorage = (): Order[] => {
  try {
    const ordersStr = localStorage.getItem('orderHistory');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch {
    return [];
  }
};

const initialState: OrderHistoryState = {
  orders: loadOrdersFromStorage(),
};

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // Add to beginning for newest first
      localStorage.setItem('orderHistory', JSON.stringify(state.orders));
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(order => order.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        localStorage.setItem('orderHistory', JSON.stringify(state.orders));
      }
    },
    clearOrderHistory: (state) => {
      state.orders = [];
      localStorage.removeItem('orderHistory');
    },
    loadUserOrders: (state, action: PayloadAction<string>) => {
      // Filter orders for specific user
      const allOrders = loadOrdersFromStorage();
      state.orders = allOrders.filter(order => order.userId === action.payload);
    },
  },
});

export const { addOrder, updateOrderStatus, clearOrderHistory, loadUserOrders } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
