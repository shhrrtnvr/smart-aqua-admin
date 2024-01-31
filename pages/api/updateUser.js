// pages/api/updateUser.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/auth/info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.headers.authorization}`,
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
