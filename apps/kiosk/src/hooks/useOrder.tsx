/**
 * THIS NEEDS HEAVY REWORKING AND CLEANUP
 * CURRENTLY JUST A QUICK IMPLEMENTATION TO GET THINGS WORKING
 * 
 * Has problem with nullable order
 */


import { Order, OrderItem } from '@openpos/socket-contracts';
import { start } from 'node:repl';
import React, { createContext, useContext, useState, useEffect } from 'react';


interface OrderContextType {
	order: Order | null;
	startOrder: () => void;
	addProduct: (item: OrderItem) => void;
	removeProduct: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearOrder: () => void;
	placeOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDER_STORAGE_KEY = 'kioskOrder';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [order, setOrder] = useState<Order | null>(() => {
		const saved = localStorage.getItem(ORDER_STORAGE_KEY);
		if (!saved) return null;
		try {
			const parsed = JSON.parse(saved);
			// Validate the structure
			if (parsed && Array.isArray(parsed.items)) {
				return {
					items: parsed.items,
					data: new Map(Object.entries(parsed.data || {}))
				};
			}
		} catch (e) {
			console.error('Failed to parse saved order:', e);
		}
		return null;
	});

	const startOrder = () => {
		setOrder({ items: [], data: new Map() });
	};

	useEffect(() => {
		if (order) {
			// Convert Map to plain object for JSON storage
			const dataObj = order.data ? Object.fromEntries(order.data) : {};
			localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify({ ...order, data: dataObj }));
		} else {
			localStorage.removeItem(ORDER_STORAGE_KEY);
		}
	}, [order]);


	const placeOrder = () => {
		console.log("Order placed:", order);
		clearOrder();
	};

	const addProduct = (item: OrderItem) => {
		console.log("Adding product to order:", item);

		setOrder(prev => {
			if (!prev) {
				return { items: [item], data: new Map<String, Object>() };
			}
			const existing = prev.items.find(p => p.id === item.id);
			if (existing) {
				return { ...prev, items: prev.items.map(p => (p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p)) };
			}
			return { ...prev, items: [...prev.items, item] };
		});
	};

	const removeProduct = (id: string) => {
		setOrder(prev => {
			if (!prev) return null;
			return { ...prev, items: prev.items.filter(p => p.id !== id) };
		});
	};

	const updateQuantity = (id: string, quantity: number) => {
		setOrder(prev => {
			if (!prev) return null;
			return { ...prev, items: prev.items.map(p => (p.id === id ? { ...p, quantity } : p)) };
		});
	};

	const clearOrder = () => setOrder(null);

	return (
		<OrderContext.Provider value={{ order, startOrder, addProduct, removeProduct, updateQuantity, clearOrder, placeOrder }}>
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
