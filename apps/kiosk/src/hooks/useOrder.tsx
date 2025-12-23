import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

interface OrderContextType {
	order: OrderItem[];
	addProduct: (item: OrderItem) => void;
	removeProduct: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearOrder: () => void;
  placeOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDER_STORAGE_KEY = 'kioskOrder';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [order, setOrder] = useState<OrderItem[]>(() => {
		const saved = localStorage.getItem(ORDER_STORAGE_KEY);
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
	}, [order]);


  const placeOrder = () => {
    console.log("Order placed:", order);
    clearOrder();
  };

	const addProduct = (item: OrderItem) => {
		setOrder(prev => {
			const existing = prev.find(p => p.id === item.id);
			if (existing) {
				return prev.map(p =>
					p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
				);
			}
			return [...prev, item];
		});
	};

	const removeProduct = (id: string) => {
		setOrder(prev => prev.filter(p => p.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		setOrder(prev =>
			prev.map(p => (p.id === id ? { ...p, quantity } : p))
		);
	};

	const clearOrder = () => setOrder([]);

	return (
		<OrderContext.Provider value={{ order, addProduct, removeProduct, updateQuantity, clearOrder,placeOrder }}>
			{children}
		</OrderContext.Provider>
	);
};

export const useOrder = () => {
	const context = useContext(OrderContext);
	if (!context) {
		throw new Error('useOrder must be used within an OrderProvider');
	}
	return context;
};
