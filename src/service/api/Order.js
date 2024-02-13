import { axiosInstance } from '../axiosInstance';

export const FETCH_AUTH_ORDER = {
  VerificationCodeSend: (data) => axiosInstance.post('/AllToken/VerificationCodeSend', data),
  VerificationCodeCheck: (data) => axiosInstance.post('/AllToken/VerificationCodeCheck', data),
  GetLatLngDistance: (data) => axiosInstance.post('/GoogleMap/GetLatLngDistance', data),
  Create: (data) => axiosInstance.post('/SbirOrder/Create', data),
  GetTreeList: (data) => axiosInstance.get('/Organize/GetTreeList', data),
  Get: (params) => axiosInstance.post('/SbirOrder/Get', params),
  GetByNo: (params, orderNo) => axiosInstance.get(`/SbirOrder/GetByNo?orderNo=${orderNo}`, params),
  CancelSbirOrder: (data) => axiosInstance.put('/SbirOrder/CancelSbirOrder', data),
  ChangeOrderStatus: (data) => axiosInstance.put('/SbirOrder/ChangeOrderStatus', data),
  GetHistoricalOrderList: (data) => axiosInstance.post('/SbirOrder/GetHistoricalOrderList', data),
  GetAuthCode: () => axiosInstance.get('/AllToken/GetAuthCode'),
  LoginByAuthCode: (params, AuthCode) => axiosInstance.get(`/AllToken/LoginByAuthCode?authCode=${AuthCode}`, params),
};
