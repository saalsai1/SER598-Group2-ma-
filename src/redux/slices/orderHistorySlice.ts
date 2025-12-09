import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderHistoryState {
  orders: Order[];
}

// Load orders from localStorage
const loadOrdersFromStorage = (): Order[] => {
  try {
    const ordersStr = localStorage.getItem('order_history');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error);
    return [];
  }
};

// Save orders to localStorage
const saveOrdersToStorage = (orders: Order[]) => {
  try {
    localStorage.setItem('order_history', JSON.stringify(orders));
    console.log('✅ Orders saved to localStorage:', orders.length);
  } catch (error) {
    console.error('❌ Failed to save orders to localStorage:', error);
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
      console.log('📦 Adding order:', action.payload);
      
      // Add new order to the beginning
      state.orders.unshift(action.payload);
      
      // Save to localStorage
      saveOrdersToStorage(state.orders);
      
      console.log('✅ Total orders now:', state.orders.length);
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        saveOrdersToStorage(state.orders);
        console.log(`✅ Order ${action.payload.orderId} status updated to ${action.payload.status}`);
      }
    },

    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload);
      saveOrdersToStorage(state.orders);
      console.log(`🗑️ Order ${action.payload} removed`);
    },

    clearOrderHistory: (state) => {
      state.orders = [];
      localStorage.removeItem('order_history');
      console.log('🗑️ All order history cleared');
    },

    // Load orders for specific user (filter in-memory)
    loadUserOrders: (state, action: PayloadAction<string>) => {
      const allOrders = loadOrdersFromStorage();
      state.orders = allOrders.filter((order) => order.userId === action.payload);
      console.log(`📋 Loaded ${state.orders.length} orders for user ${action.payload}`);
    },
  },
});

export const {
  addOrder,
  updateOrderStatus,
  removeOrder,
  clearOrderHistory,
  loadUserOrders,
} = orderHistorySlice.actions;

export default orderHistorySlice.reducer;

// Selectors
export const selectUserOrders = (userId: string) => (state: { orderHistory: OrderHistoryState }) => {
  return state.orderHistory.orders.filter((order) => order.userId === userId);
};

export const selectAllOrders = (state: { orderHistory: OrderHistoryState }) => {
  return state.orderHistory.orders;
};

export const selectOrderById = (orderId: string) => (state: { orderHistory: OrderHistoryState }) => {
  return state.orderHistory.orders.find((order) => order.id === orderId);
};