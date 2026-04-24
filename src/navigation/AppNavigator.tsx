import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppRoutes } from '../constants/routes.constant'
import MainTabsScreen from '../screens/MainTabs.screen'
import HotelDetailsScreen from '../screens/HotelDetails.screen'
import NotFoundScreen from '../screens/NotFound.screen'
import RestaurantDetailsScreen from '../screens/RestaurantDetails.screen'
import UserListRestaurantsScreen from '../screens/UserListRestaurants.screen'
import AuthCallbackScreen from '../screens/auth/AuthCallback.screen'
import LoginScreen from '../screens/auth/Login.screen'
import RegisterScreen from '../screens/auth/Register.screen'
import type { RootStackParamList } from './navigation.types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName={AppRoutes.ROOT}>
      <Stack.Screen
        name={AppRoutes.ROOT}
        component={MainTabsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={AppRoutes.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: 'Connexion',
        }}
      />
      <Stack.Screen
        name={AppRoutes.REGISTER}
        component={RegisterScreen}
        options={{
          headerTitle: 'Inscription',
        }}
      />
      <Stack.Screen
        name={AppRoutes.AUTH_CALLBACK}
        component={AuthCallbackScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={AppRoutes.RESTAURANT_DETAILS}
        component={RestaurantDetailsScreen}
        options={{
          headerTitle: 'Restaurant',
        }}
      />
      <Stack.Screen
        name={AppRoutes.HOTEL_DETAILS}
        component={HotelDetailsScreen}
        options={{
          headerTitle: 'Hôtel',
        }}
      />
      <Stack.Screen
        name={AppRoutes.USER_LIST_RESTAURANTS}
        component={UserListRestaurantsScreen}
        options={({ route }) => ({
          headerTitle: route.params.listTitle,
        })}
      />
      <Stack.Screen
        name={AppRoutes.NOT_FOUND}
        component={NotFoundScreen}
        options={{
          headerTitle: '404',
        }}
      />
    </Stack.Navigator>
  )
}
