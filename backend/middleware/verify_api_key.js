const headerKeys = ['x-api-key', 'x-apikey', 'api-key', 'apikey'];

const verifyApiKey = (req, res, next) => {
    const configuredKey = process.env.API_KEY;

    if (!configuredKey) {
        return res.status(500).json({ errors: [{ msg: 'Server configuration error' }] });
    }

    const headerKey = headerKeys
        .map((key) => req.get(key))
        .find((value) => typeof value === 'string' && value.trim().length > 0);

    const queryKey = req.query.apiKey ?? req.query.api_key;
    const normalizedQueryKey = Array.isArray(queryKey) ? queryKey[0] : queryKey;

    const candidateKey = headerKey?.trim() || (typeof normalizedQueryKey === 'string' ? normalizedQueryKey : undefined);

    if (candidateKey !== configuredKey) {
        return res.status(401).json({ errors: [{ msg: 'Invalid API key' }] });
    }

    next();
};

export default verifyApiKey;