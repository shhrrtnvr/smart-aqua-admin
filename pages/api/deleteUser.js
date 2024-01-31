// pages/api/deleteUser.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/user/delete/${req.query.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.headers.authorization}`,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
