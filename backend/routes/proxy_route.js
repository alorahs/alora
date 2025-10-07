import express from 'express';
import fetch, { FormData as FetchFormData, Blob as FetchBlob } from 'node-fetch';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Proxy endpoint for API requests that need API key authentication
router.post('/proxy-api', async (req, res) => {
  try {
    const { url, method = 'GET', body, headers = {} } = req.body;
    
    // Validate the requested URL is to our own API
    if (!url || !url.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    // Construct full API URL - use localhost to avoid proxy loop
    // Add '/api' prefix to match the actual API route structure
    const apiUrl = `http://localhost:${process.env.PORT || 5000}/api${url}`;
    
    // Add API key to headers
    const apiHeaders = {
      apiKey: process.env.API_KEY,
      ...headers
    };

    // Ensure JSON content type for request bodies when not already supplied
    if (method !== 'GET' && method !== 'HEAD' && !apiHeaders['Content-Type'] && !apiHeaders['content-type']) {
      apiHeaders['Content-Type'] = 'application/json';
    }

    // Forward cookies from the client request to the upstream API
    if (req.headers.cookie) {
      apiHeaders.cookie = req.headers.cookie;
    }
    
    // Make the request to the actual API
    const fetchOptions = {
      method,
      headers: apiHeaders
    };
    
    // Only add body for methods that support it and have a body
    if (method !== 'GET' && method !== 'HEAD' && body !== undefined && body !== null) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
  const response = await fetch(apiUrl, fetchOptions);
  const rawHeaders = response.headers.raw();
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Forward the response with appropriate status and content type
    res.status(response.status);

    // Forward Set-Cookie headers so the browser stores authentication cookies
    if (rawHeaders['set-cookie']) {
      res.set('Set-Cookie', rawHeaders['set-cookie']);
    }
    
    if (contentType) {
      res.set('Content-Type', contentType);
    }
    
    // Send JSON or text response based on content type
    if (typeof data === 'object') {
      res.json(data);
    } else {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// Proxy endpoint for multipart/form-data requests (e.g., file uploads)
router.post('/proxy-upload', upload.any(), async (req, res) => {
  try {
    const { url, method = 'POST', headers: headersPayload } = req.body;

    if (!url || !url.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const apiUrl = `http://localhost:${process.env.PORT || 5000}/api${url}`;

    const apiHeaders = {
      apiKey: process.env.API_KEY,
    };

    // Merge any additional headers provided (expecting JSON string)
    if (headersPayload) {
      try {
        const parsedHeaders = typeof headersPayload === 'string' ? JSON.parse(headersPayload) : headersPayload;
        Object.assign(apiHeaders, parsedHeaders);
      } catch (error) {
        console.warn('Failed to parse proxy upload headers payload:', error);
      }
    }

    if (req.headers.cookie) {
      apiHeaders.cookie = req.headers.cookie;
    }

    const formData = new FetchFormData();

    // Append regular fields (exclude control fields)
    Object.entries(req.body).forEach(([key, value]) => {
      if (['url', 'method', 'headers'].includes(key)) {
        return;
      }
      formData.append(key, value);
    });

    // Append files captured by multer
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        formData.append(
          file.fieldname,
          new FetchBlob([file.buffer], { type: file.mimetype }),
          file.originalname
        );
      });
    }

    const response = await fetch(apiUrl, {
      method: method || 'POST',
      headers: apiHeaders,
      body: formData,
    });

    const rawHeaders = response.headers.raw();

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    res.status(response.status);

    if (rawHeaders['set-cookie']) {
      res.set('Set-Cookie', rawHeaders['set-cookie']);
    }

    if (contentType) {
      res.set('Content-Type', contentType);
    }

    if (typeof data === 'object') {
      res.json(data);
    } else {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy upload error:', error);
    res.status(500).json({ error: 'Proxy upload failed' });
  }
});

// Proxy endpoint to fetch protected files by ID
router.get('/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    const searchParams = new URLSearchParams(req.query);
    const queryString = searchParams.toString();
    const apiUrl = `http://localhost:${process.env.PORT || 5000}/api/files/${id}${queryString ? `?${queryString}` : ''}`;

    const apiHeaders = {
      apiKey: process.env.API_KEY,
    };

    if (req.headers.cookie) {
      apiHeaders.cookie = req.headers.cookie;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: apiHeaders,
    });

    const rawHeaders = response.headers.raw();

    res.status(response.status);

    if (rawHeaders['set-cookie']) {
      res.set('Set-Cookie', rawHeaders['set-cookie']);
    }

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.set('Content-Type', contentType);
    }

    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      res.set('Content-Disposition', contentDisposition);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error('Proxy file fetch error:', error);
    res.status(500).json({ error: 'Proxy file fetch failed' });
  }
});

export default router;