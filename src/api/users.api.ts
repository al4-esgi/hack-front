import axios from 'axios'
import apiClient from './axios'

type GetCurrentUserResponse = {
  id: string | number
  firstname: string
  lastname: string
  email: string
  photoUrl?: string | null
  photo_url?: string | null
}

export type CurrentUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  photoUrl: string | null
}

type UserListResponse = {
  id: string | number
  name: string
  itemsCount: number
  createdAt: string
  updatedAt: string
}

export type UserList = {
  id: string
  name: string
  itemsCount: number
  createdAt: string
  updatedAt: string
}

type CreateUserListPayload = {
  name: string
}

type UserListItemResponse = {
  id?: string | number
  itemId?: string | number
  item_id?: string | number
  itemType?: string
  item_type?: string
  name?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  addedAt?: string | null
  added_at?: string | null
}

type UserListItemsResponse = {
  id: string | number
  name: string
  items?: UserListItemResponse[] | null
  restaurants?: UserListItemResponse[] | null
}

export type ListItemType = 'hotel' | 'restaurant' | 'bistro' | 'other' | string

export type UserListItem = {
  id: string
  itemId: string
  itemType: ListItemType
  name: string
  address: string | null
  city: string | null
  country: string | null
  addedAt: string | null
}

export type UserListItems = {
  id: string
  name: string
  items: UserListItem[]
}

// Backward-compatible aliases.
export type UserListRestaurant = UserListItem
export type UserListRestaurants = {
  id: string
  name: string
  restaurants: UserListRestaurant[]
}

type SetItemInListParams =
  | {
      listId: string | number
      listName?: never
    }
  | {
      listId?: never
      listName: string
    }

export type AddListItemInput = {
  itemType: ListItemType
  itemId: string | number
  name?: string
}

type MutationRequest = {
  method: 'POST' | 'DELETE'
  url: string
  data?: Record<string, unknown>
}

export class ListMutationRouteNotFoundError extends Error {
  constructor(message = 'No supported list mutation route found on API.') {
    super(message)
    this.name = 'ListMutationRouteNotFoundError'
  }
}

export class UserListNotFoundError extends Error {
  constructor(listName: string) {
    super(`User list "${listName}" not found.`)
    this.name = 'UserListNotFoundError'
  }
}

export class ListItemNameRequiredError extends Error {
  constructor(itemType: string) {
    super(`Name is required for custom list item type "${itemType}".`)
    this.name = 'ListItemNameRequiredError'
  }
}

function normalizeUserList(list: UserListResponse): UserList {
  return {
    id: String(list.id),
    name: list.name,
    itemsCount: list.itemsCount,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  }
}

function normalizeItemType(value: string | null | undefined): ListItemType {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) {
    return 'restaurant'
  }

  return normalized
}

function normalizeUserListItem(item: UserListItemResponse): UserListItem {
  const itemId = String(item.itemId ?? item.item_id ?? item.id ?? '')
  return {
    id: itemId,
    itemId,
    itemType: normalizeItemType(item.itemType ?? item.item_type),
    name: item.name ?? '',
    address: item.address ?? null,
    city: item.city ?? null,
    country: item.country ?? null,
    addedAt: item.addedAt ?? item.added_at ?? null,
  }
}

function normalizeUserListItemsPayload(payload: UserListItemsResponse): UserListItems {
  const rawItems = payload.items ?? payload.restaurants ?? []
  return {
    id: String(payload.id),
    name: payload.name,
    items: rawItems.map(normalizeUserListItem),
  }
}

function buildListItemsUrlFromId(userId: string | number | 'me', listId: string | number) {
  return `/api/v1/users/${userId}/lists/${listId}/items`
}

function buildListItemsUrlFromName(userId: string | number | 'me', listName: string) {
  return `/api/v1/users/${userId}/lists/by-name/${encodeURIComponent(listName)}/items`
}

function buildListRestaurantsUrlFromId(userId: string | number | 'me', listId: string | number) {
  return `/api/v1/users/${userId}/lists/${listId}/restaurants`
}

function buildListRestaurantsUrlFromName(userId: string | number | 'me', listName: string) {
  return `/api/v1/users/${userId}/lists/by-name/${encodeURIComponent(listName)}/restaurants`
}

function buildListRestaurantMutationUrl(
  userId: string | number,
  listId: string | number,
  restaurantId: string | number,
) {
  return `/api/v1/users/${userId}/lists/${listId}/restaurants/${restaurantId}`
}

function buildAddItemMutationRequests(
  userId: string | number,
  listId: string | number,
  item: AddListItemInput,
): MutationRequest[] {
  const itemType = normalizeItemType(item.itemType)
  const itemId = item.itemId
  const itemName = item.name?.trim()

  if (itemType !== 'restaurant' && itemType !== 'hotel' && !itemName) {
    throw new ListItemNameRequiredError(itemType)
  }

  const baseItemsUrl = buildListItemsUrlFromId(userId, listId)
  const payload: Record<string, unknown> = {
    itemType,
    itemId,
  }
  if (itemName) {
    payload.name = itemName
  }

  const requests: MutationRequest[] = [
    { method: 'POST', url: baseItemsUrl, data: payload },
    { method: 'POST', url: `${baseItemsUrl}/${itemId}`, data: payload },
  ]

  // Backward compatibility for older restaurant-only route.
  if (itemType === 'restaurant') {
    requests.push(
      { method: 'POST', url: buildListRestaurantMutationUrl(userId, listId, itemId) },
      { method: 'POST', url: buildListRestaurantsUrlFromId(userId, listId), data: { restaurantId: itemId } },
    )
  }

  return requests
}

function buildToggleItemMutationRequests(
  userId: string | number,
  listId: string | number,
  item: AddListItemInput,
): MutationRequest[] {
  const itemType = normalizeItemType(item.itemType)
  const itemId = item.itemId
  const itemName = item.name?.trim()
  const baseItemsUrl = buildListItemsUrlFromId(userId, listId)

  const payload: Record<string, unknown> = {
    itemType,
    itemId,
  }
  if (itemName) {
    payload.name = itemName
  }

  const requests: MutationRequest[] = [
    { method: 'POST', url: baseItemsUrl, data: payload },
    { method: 'POST', url: `${baseItemsUrl}/${itemId}`, data: payload },
  ]

  // Backward compatibility for older restaurant-only route.
  if (itemType === 'restaurant') {
    requests.push(
      { method: 'POST', url: buildListRestaurantMutationUrl(userId, listId, itemId) },
      { method: 'POST', url: buildListRestaurantsUrlFromId(userId, listId), data: { restaurantId: itemId } },
    )
  }

  return requests
}

function buildRemoveItemMutationRequests(
  userId: string | number,
  listId: string | number,
  itemType: ListItemType,
  itemId: string | number,
): MutationRequest[] {
  const normalizedType = normalizeItemType(itemType)
  const baseItemsUrl = buildListItemsUrlFromId(userId, listId)

  const requests: MutationRequest[] = [
    {
      method: 'DELETE',
      url: baseItemsUrl,
      data: { itemType: normalizedType, itemId },
    },
    {
      method: 'DELETE',
      url: `${baseItemsUrl}/${itemId}`,
      data: { itemType: normalizedType },
    },
    {
      method: 'DELETE',
      url: `${baseItemsUrl}/${normalizedType}/${itemId}`,
    },
  ]

  if (normalizedType === 'restaurant') {
    requests.push(
      { method: 'DELETE', url: buildListRestaurantMutationUrl(userId, listId, itemId) },
      { method: 'DELETE', url: buildListRestaurantsUrlFromId(userId, listId), data: { restaurantId: itemId } },
    )
  }

  // Fallback for APIs where POST /items is a true toggle:
  // sending the same item again removes it from the list.
  return [
    ...requests,
    ...buildToggleItemMutationRequests(userId, listId, {
      itemType: normalizedType,
      itemId,
    }),
  ]
}

async function runListMutationRequests(requests: MutationRequest[]) {
  for (const request of requests) {
    try {
      await apiClient.request({
        method: request.method,
        url: request.url,
        data: request.data,
      })
      return
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error
      }

      const statusCode = error.response?.status
      if (statusCode === 404 || statusCode === 405) {
        continue
      }

      throw error
    }
  }

  throw new ListMutationRouteNotFoundError()
}

async function resolveListId(userId: string | number, params: SetItemInListParams): Promise<string> {
  if (params.listId != null) {
    return String(params.listId)
  }

  const normalizedRequestedName = params.listName.trim().toLowerCase()
  const userLists = await getUserLists(userId)
  const matchedList = userLists.find((list) => list.name.trim().toLowerCase() === normalizedRequestedName)

  if (!matchedList) {
    throw new UserListNotFoundError(params.listName)
  }

  return matchedList.id
}

async function fetchListItemsWithFallback(
  primaryUrl: string,
  fallbackUrl: string,
): Promise<UserListItems> {
  try {
    const { data } = await apiClient.get<UserListItemsResponse>(primaryUrl)
    return normalizeUserListItemsPayload(data)
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      throw error
    }
  }

  const { data } = await apiClient.get<UserListItemsResponse>(fallbackUrl)
  return normalizeUserListItemsPayload(data)
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<GetCurrentUserResponse>('/api/v1/users/me')

  return {
    id: String(data.id),
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    photoUrl: data.photoUrl ?? data.photo_url ?? null,
  }
}

export async function getUserLists(userId: string | number): Promise<UserList[]> {
  const { data } = await apiClient.get<UserListResponse[]>(`/api/v1/users/${userId}/lists`)
  return data.map(normalizeUserList)
}

export async function createUserList(
  userId: string | number,
  payload: CreateUserListPayload,
): Promise<UserList> {
  const { data } = await apiClient.post<UserListResponse>(`/api/v1/users/${userId}/lists`, payload)
  return normalizeUserList(data)
}

export async function getUserListItemsByName(
  userId: string | number,
  listName: string,
): Promise<UserListItems> {
  const primaryUrl = buildListItemsUrlFromName(userId, listName)
  const fallbackUrl = buildListRestaurantsUrlFromName(userId, listName)

  try {
    return await fetchListItemsWithFallback(primaryUrl, fallbackUrl)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        id: '',
        name: listName,
        items: [],
      }
    }

    throw error
  }
}

export async function getUserListItemsById(
  userId: string | number,
  listId: string | number,
): Promise<UserListItems> {
  const primaryUrl = buildListItemsUrlFromId(userId, listId)
  const fallbackUrl = buildListRestaurantsUrlFromId(userId, listId)
  return fetchListItemsWithFallback(primaryUrl, fallbackUrl)
}

export async function addItemToUserList(
  userId: string | number,
  params: SetItemInListParams,
  item: AddListItemInput,
): Promise<void> {
  const listId = await resolveListId(userId, params)
  const requests = buildAddItemMutationRequests(userId, listId, item)
  await runListMutationRequests(requests)
}

export async function removeItemFromUserList(
  userId: string | number,
  params: SetItemInListParams,
  item: Pick<AddListItemInput, 'itemType' | 'itemId'>,
): Promise<void> {
  const listId = await resolveListId(userId, params)
  const requests = buildRemoveItemMutationRequests(userId, listId, item.itemType, item.itemId)
  await runListMutationRequests(requests)
}

// Backward-compatible wrappers.
export async function getUserListRestaurantsByName(
  userId: string | number,
  listName: string,
): Promise<UserListRestaurants> {
  const itemsResult = await getUserListItemsByName(userId, listName)
  return {
    id: itemsResult.id,
    name: itemsResult.name,
    restaurants: itemsResult.items,
  }
}

export async function getUserListRestaurantsById(
  userId: string | number,
  listId: string | number,
): Promise<UserListRestaurants> {
  const itemsResult = await getUserListItemsById(userId, listId)
  return {
    id: itemsResult.id,
    name: itemsResult.name,
    restaurants: itemsResult.items,
  }
}

export async function addRestaurantToUserList(
  userId: string | number,
  params: SetItemInListParams,
  restaurantId: string | number,
): Promise<void> {
  await addItemToUserList(userId, params, {
    itemType: 'restaurant',
    itemId: restaurantId,
  })
}

export async function removeRestaurantFromUserList(
  userId: string | number,
  params: SetItemInListParams,
  restaurantId: string | number,
): Promise<void> {
  await removeItemFromUserList(userId, params, {
    itemType: 'restaurant',
    itemId: restaurantId,
  })
}
