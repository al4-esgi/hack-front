import { AppRoutes } from '../constants/routes.constant'

export type RootStackParamList = {
  [AppRoutes.ROOT]: undefined
  [AppRoutes.LOGIN]: undefined
  [AppRoutes.REGISTER]: undefined
  [AppRoutes.AUTH_CALLBACK]:
    | {
        jwt?: string
        token?: string
        access_token?: string
      }
    | undefined
  [AppRoutes.RESTAURANT_DETAILS]: {
    restaurantId: number
  }
  [AppRoutes.HOTEL_DETAILS]: {
    hotelId: number
  }
  [AppRoutes.USER_LIST_RESTAURANTS]: {
    userId: string
    listId: string
    listTitle: string
  }
  [AppRoutes.NOT_FOUND]: undefined
}
