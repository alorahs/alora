// Utility functions for making API requests through the backend proxy
import { API_URL } from '../context/auth_provider';

/**
 * Make an API request through the backend proxy
 * This hides the API key from the client-side network requests
 */
export async function proxyApiRequest(url, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    ...restOptions
  } = options;

  if (body instanceof FormData) {
    return proxyUploadRequest(url, body, { method, headers, ...restOptions });
  }

  try {
    const response = await fetch(`${API_URL}/proxy/proxy-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        url,
        method,
        body,
        headers
      }),
      credentials: 'include', // Include credentials to forward cookies
      ...restOptions
    });

    return response;
  } catch (error) {
    console.error('Proxy API request failed:', error);
    throw error;
  }
}

/**
 * Fetch data through the proxy
 */
export async function proxyFetch(url, options = {}) {
  const response = await proxyApiRequest(url, options);
  
  // Check content type to determine how to parse the response
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
}

/**
 * Upload files through the proxy using multipart/form-data
 */
export async function proxyUploadRequest(url, formData, options = {}) {
  if (!(formData instanceof FormData)) {
    throw new Error('proxyUploadRequest expects a FormData instance');
  }

  const {
    method = 'POST',
    headers = {},
    ...restOptions
  } = options;

  const uploadFormData = new FormData();
  uploadFormData.append('url', url);
  uploadFormData.append('method', method);

  if (headers && Object.keys(headers).length > 0) {
    uploadFormData.append('headers', JSON.stringify(headers));
  }

  for (const [key, value] of formData.entries()) {
    uploadFormData.append(key, value);
  }

  try {
    const response = await fetch(`${API_URL}/proxy/proxy-upload`, {
      method: 'POST',
      body: uploadFormData,
      credentials: 'include',
      ...restOptions
    });

    return response;
  } catch (error) {
    console.error('Proxy upload request failed:', error);
    throw error;
  }
}