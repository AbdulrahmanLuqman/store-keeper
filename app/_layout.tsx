import { ProductProvider } from "@/context/useProducts";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ProductProvider>
      <Stack screenOptions={{headerShown: false}} />
    </ProductProvider>
  )
}
