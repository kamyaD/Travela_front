import axios from 'axios';
import Cookies from 'cookies-js';
import { resolveBaseUrl } from '.';

const baseUrl = resolveBaseUrl();

class DocumentAPI {
  static fetchDocuments(){
    return axios.get(`${baseUrl}/documents`);
  }

  static updateDocument(documentId, updatedDocument) {
    return axios.put(`${baseUrl}/documents/${documentId}`, updatedDocument);
  }
  static postDocument(documentData) {
    return axios.post(`${baseUrl}/documents`, documentData);
  }
  static setToken () {
    const token = Cookies.get('jwt-token');
    axios.defaults.headers.common['Authorization'] = token;
  } 
}

export default DocumentAPI;
