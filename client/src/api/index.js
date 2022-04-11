import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const createOrUpdateLotString = async (id, payload) => await api.post(`/lotString/${id}`, payload);
export const getLotsStringsIds = async () => await api.get(`/lotStringsIds`);
export const getLotStringById = async (id) => await api.get(`/lotString/${id}`);

const apis = {
  createOrUpdateLotString,
  getLotsStringsIds,
  getLotStringById
};

export default apis;
