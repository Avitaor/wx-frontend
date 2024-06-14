// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addUserInterfaceInfo POST /api/userInterfaceInfo/add */
export async function addUserInterfaceInfoUsingPOST(
  body: API.UserInterfaceInfoAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponselong>('/api/userInterfaceInfo/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteUserInterfaceInfo POST /api/userInterfaceInfo/delete */
export async function deleteUserInterfaceInfoUsingPOST(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/userInterfaceInfo/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getUserInterfaceInfoById GET /api/userInterfaceInfo/get */
export async function getUserInterfaceInfoByIdUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInterfaceInfoByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserInterfaceInfo>('/api/userInterfaceInfo/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listUserInterfaceInfo GET /api/userInterfaceInfo/list */
export async function listUserInterfaceInfoUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserInterfaceInfoUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserInterfaceInfo>('/api/userInterfaceInfo/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listUserInterfaceInfoByPage GET /api/userInterfaceInfo/list/page */
export async function listUserInterfaceInfoByPageUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserInterfaceInfoByPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserInterfaceInfo>('/api/userInterfaceInfo/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateUserInterfaceInfo POST /api/userInterfaceInfo/update */
export async function updateUserInterfaceInfoUsingPOST(
  body: API.UserInterfaceInfoUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/userInterfaceInfo/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getRemainingCalls GET /api/interface/remainingCalls */
export async function getRemainingCallsUsingGET(
  params: API.RemainingCallsRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponselong>('/api/userInterfaceInfo/remainingCalls', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function incrementCallCountUsingPOST(
  body: { userId, interfaceInfoId },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/userInterfaceInfo/incrementCallCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllInterfaceCallsByUserId GET /api/userInterfaceInfo/allInterfaceCalls */
export async function getAllInterfaceCallsByUserIdUsingGET(
  params: { userId: number },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserInterfaceInfo>('/api/userInterfaceInfo/allInterfaceCalls', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
