// pages/api/userInfo.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/user/info/${req.query.id}`, {
    headers: {
      Authorization: `Bearer ${req.headers.authorization}`,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
