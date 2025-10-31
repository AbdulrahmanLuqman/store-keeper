import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as SQLite from 'expo-sqlite';

export interface ProductType {
  id: string;
  image?: string;
  name: string;
  quantity: string;
  price: string;
}

interface ProductContextType {
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  handleDelete: (id: string) => void;
  handleEdit: (id: string, updatedProduct: ProductType) => Promise<void>;
  addProduct: (product: ProductType) => Promise<void>;
}

const db = SQLite.openDatabaseSync('store.db');
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const setup = async () => {
      try {
        await db.execAsync('DROP TABLE IF EXISTS products');
        
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            image TEXT,
            name TEXT,
            quantity TEXT,
            price TEXT
          )
        `);

        const data: ProductType[] = await db.getAllAsync('SELECT * FROM products');
        setProducts(data);
        console.log('Database setup complete');
      } catch (error) {
        console.error('Database setup error:', error);
      }
    };

    setup();
  }, []);

  const addProduct = async (product: ProductType) => {
    try {
      await db.runAsync(
        'INSERT INTO products (id, name, quantity, price, image) VALUES (?, ?, ?, ?, ?)',
        [product.id, product.name, product.quantity, product.price, product.image || null]
      );

      setProducts((prev) => [...prev, product]);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = async (id: string, updatedProduct: ProductType) => {
    try {
      await db.runAsync(
        'UPDATE products SET name = ?, quantity = ?, price = ?, image = ? WHERE id = ?',
        [updatedProduct.name, updatedProduct.quantity, updatedProduct.price, updatedProduct.image || null, id]
      );
      
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, handleDelete, handleEdit, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
};