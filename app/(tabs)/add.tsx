import 'react-native-get-random-values';
import { View, Image, Text, KeyboardAvoidingView, StyleSheet, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Camera from '@/components/Camera';
import { useState, useCallback } from 'react';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useProducts, ProductType } from '@/context/useProducts';
import { v4 as uuidv4 } from 'uuid';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

const AddProducts = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { addProduct, handleEdit } = useProducts();
  const router = useRouter();
  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      if (params.editMode === 'true' && params.productId) {
        setEditingId(params.productId as string);
        setProductName((params.productName as string) || "");
        setQuantity((params.productQuantity as string) || "");
        setPrice((params.productPrice as string) || "");
        const imgUri = params.productImage as string;
        setImageUri(imgUri && imgUri !== '' && imgUri !== 'undefined' ? imgUri : undefined);
      } else {
        clearForm();
      }
    }, [params.editMode, params.productId, params.productName, params.productQuantity, params.productPrice, params.productImage])
  );

  const clearForm = () => {
    setEditingId(null);
    setProductName("");
    setQuantity("");
    setPrice("");
    setImageUri(undefined);
  };

  const handleCameraCapture = (uri: string) => {
    setImageUri(uri);
  };

  const handleSave = async () => {
    if (!productName.trim() || !quantity.trim() || !price.trim()) {
      console.log("All fields are required, except image");
      return;
    }

    try {
      if (editingId) {
        const updatedProduct: ProductType = {
          id: editingId,
          name: productName.trim(),
          quantity: quantity.trim(),
          price: price.trim(),
          image: imageUri
        };

        await handleEdit(editingId, updatedProduct);
        console.log('Product updated successfully');
      } else {
        const newProduct: ProductType = {
          id: uuidv4(),
          name: productName.trim(),
          quantity: quantity.trim(),
          price: price.trim(),
          image: imageUri
        };

        await addProduct(newProduct);
        console.log('Product created successfully');
      }
      clearForm();
      router.push('/');
      
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleCancel = () => {
    clearForm();
    if (editingId) {
      router.push('/');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingId ? 'Edit Product' : 'Add Product'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageSection}>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(undefined)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => setShowCamera(true)}
            >
              <Feather name="camera" size={24} color="#94a3b8" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor="#94a3b8"
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSave}
          >
            <Feather name={editingId ? "check" : "save"} size={20} color="white" />
            <Text style={styles.primaryButtonText}>
              {editingId ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCancel}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Camera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#dc2626',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProducts;