import { Tabs, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const TabsLayout = () => {
  const router = useRouter();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "whitesmoke",
        borderTopWidth: 0
      },
      tabBarActiveTintColor: "#2563eb",
      tabBarInactiveTintColor: "black",
      tabBarActiveBackgroundColor: "white",
    }}>
      <Tabs.Screen
        name='index'
        options={{
            title: "Products",
            tabBarIcon: ({color, focused})=>  <Ionicons name={focused ? "cube-sharp" : "cube-outline"} size={24} color={color} />            
        }}
      />

      <Tabs.Screen
        name='add'
        options={{
            title: "Add Products",
            tabBarIcon: ({color, focused})=>  <FontAwesome5 name={focused ? "plus-circle" : "plus"} size={24} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/add');
          },
        }}
      />
    </Tabs>
  )
}

export default TabsLayout