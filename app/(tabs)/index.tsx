import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useProducts, ProductType } from "@/context/useProducts";
import ProductCard from "@/components/ProductsCard";
import { useRouter } from "expo-router";

export default function Index() {
  const { products, handleDelete } = useProducts();
  const router = useRouter();

  const handleEdit = (product: ProductType) => {
    router.push({
      pathname: '/add',
      params: { 
        editMode: 'true',
        productId: product.id,
        productName: product.name,
        productQuantity: product.quantity,
        productPrice: product.price,
        productImage: product.image || ''
      }
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Inventory</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Feather name="refresh-cw" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="package" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No products yet</Text>
          <Text style={styles.emptySubText}>
            Tap the Add Product tab to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  refreshButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  list: {
    padding: 20,
  },
});