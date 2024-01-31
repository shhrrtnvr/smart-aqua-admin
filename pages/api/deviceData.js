// pages/api/deviceData.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/device/${req.query.id}/data/range/WEEK`, {
    headers: {
      Authorization: `Bearer ${req.headers.authorization}`,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
