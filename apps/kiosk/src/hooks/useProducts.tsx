import { Product } from "@openpos/socket-contracts";
import { useEffect, useState } from "react";




export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    window.products.getProducts().then((initial) => {
      if (Array.isArray(initial)) setProducts(initial);
    });

    if (window.products.onProducts) {
      unsubscribe = window.products.onProducts((latest: Product[]) => {
        setProducts(latest);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return products;
}
