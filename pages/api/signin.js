// pages/api/signin.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // Forward any other headers you need
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
