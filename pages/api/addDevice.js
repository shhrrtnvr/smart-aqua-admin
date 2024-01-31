// pages/api/addDevice.js
export default async function handler(req, res) {
  const { userId, ...deviceDetails } = req.body; // Extract userId from the request body

  const response = await fetch(`${process.env.API_URL}/device/add/${userId}`, { // Include userId in the fetch URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.headers.authorization}`,
    },
    body: JSON.stringify(deviceDetails), // Pass the remaining device details in the request body
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
