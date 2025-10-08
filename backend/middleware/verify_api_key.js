const headerKeys = ['x-api-key', 'x-apikey', 'api-key', 'apikey', 'apiKey'];

const extractHeaderKey = (req) => headerKeys
    .map((key) => req.get(key))
    .find((value) => typeof value === 'string' && value.trim().length > 0);

const extractQueryKey = (req) => {
    const queryKey = req.query.apiKey ?? req.query.api_key;
    if (Array.isArray(queryKey)) {
        return queryKey.find((value) => typeof value === 'string' && value.trim().length > 0);
    }
    return typeof queryKey === 'string' && queryKey.trim().length > 0 ? queryKey : undefined;
};

export const getCandidateApiKey = (req) => {
    const headerKey = extractHeaderKey(req);
    if (headerKey?.trim()) {
        return headerKey.trim();
    }
    const queryKey = extractQueryKey(req);
    return queryKey?.trim();
};

export const isApiKeyValid = (req) => {
    const configuredKey = process.env.API_KEY;
    if (!configuredKey) {
        return false;
    }
    const candidateKey = getCandidateApiKey(req);
    if (!candidateKey) {
        return false;
    }
    return candidateKey === configuredKey;
};

const verifyApiKey = (req, res, next) => {
    const configuredKey = process.env.API_KEY;

    if (!configuredKey) {
        return res.status(500).json({ errors: [{ msg: 'Server configuration error' }] });
    }

    if (!isApiKeyValid(req)) {
        return res.status(401).json({ errors: [{ msg: 'Invalid API key' }] });
    }

    next();
};

export default verifyApiKey;