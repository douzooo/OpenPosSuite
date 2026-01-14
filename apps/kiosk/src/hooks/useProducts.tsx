import { Product } from "@openpos/socket-contracts";
import { useEffect, useState } from "react";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if ((window as any).products.onProducts) {
      unsubscribe = (window as any).products.onProducts((latest: Product[]) => {
        setProducts(latest);
      });
    }

    (window as any).products.getProducts().then((initial: Product[]) => {
      if (Array.isArray(initial)) setProducts(initial);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return products;
}
