import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const createOrUpdateLotString = async (id, payload) =>
  await api.post(`/api/lotString/${id}`, payload);
export const getLotsStringsIds = async () => await api.get(`/api/lotStringsIds`);
export const getLotStringById = async (id) => await api.get(`/api/lotString/${id}`);

const apis = {
  createOrUpdateLotString,
  getLotsStringsIds,
  getLotStringById,
};

export default apis;
