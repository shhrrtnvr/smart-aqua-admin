// pages/api/userList.js
export default async function handler(req, res) {
  const response = await fetch(`${process.env.API_URL}/user/list`, {
    headers: {
      Authorization: `Bearer ${req.headers.authorization}`,
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
