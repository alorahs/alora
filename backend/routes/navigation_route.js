import express from 'express';

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: { "User-Agent": "AloraApp/1.0 (https://alora.com)" },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

router.get("/forward", async (req, res) => {
  const { address } = req.query;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`, {
      headers: { "User-Agent": "AloraApp/1.0 (https://alora.com)" },
    });
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      res.json({ lat, lon });
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coordinates" });
  }
});

export default router;