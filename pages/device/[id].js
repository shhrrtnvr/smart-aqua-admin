import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box, TextField, Grid
} from '@mui/material';
import { Modal } from '@mui/material';
import {Line} from "react-chartjs-2";
import { Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

const Device = () => {
  const router = useRouter();
  const { id } = router.query;
  const [device, setDevice] = useState(null);
  const [open, setOpen] = useState(false);
  const [editDeviceOpen, setEditDeviceOpen] = useState(false); // State for edit device modal visibility
  const [editedLocationName, setEditedLocationName] = useState(''); // State for edited location name
  const [editedLocationAddress, setEditedLocationAddress] = useState(''); // State for edited location address
  const [editedLatitude, setEditedLatitude] = useState(''); // State for edited latitude
  const [editedLongitude, setEditedLongitude] = useState(''); // State for edited longitude
  const [deviceData, setDeviceData] = useState([]);


  const handleOpenEditModal = () => {
    // Set the edited device details state with the current device details
    setEditedLocationName(device.locationName);
    setEditedLocationAddress(device.locationAddress);
    setEditedLatitude(device.latitude);
    setEditedLongitude(device.longitude);
    setEditDeviceOpen(true);
  };

  const handleCancelEditModal = () => {
    setEditedLocationName('');
    setEditedLocationAddress('');
    setEditedLatitude('');
    setEditedLongitude('');
    setEditDeviceOpen(false);
  };

  const handleConfirmEditModal = async () => {
    try {
      const response = await fetch('http://139.59.54.184:8080/device/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          id: device.id, // Include the device id in the request body
          locationName: editedLocationName,
          locationAddress: editedLocationAddress,
          latitude: editedLatitude,
          longitude: editedLongitude,
        }),
      });

      if (response.ok) {
        // Device updated successfully
        console.log('Device updated successfully');
        handleCancelEditModal();
        // Fetch the updated device info
        const deviceResponse = await fetch(`http://139.59.54.184:8080/device/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (deviceResponse.ok) {
          const data = await deviceResponse.json();
          setDevice(data);
        } else {
          console.error('Error fetching device:', deviceResponse.statusText);
        }
      } else {
        // Handle unsuccessful device update
        console.error('Error updating device:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    if (id) {
      const fetchDevice = async () => {
        const response = await fetch(`http://139.59.54.184:8080/device/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDevice(data);
        } else {
          console.error('Error fetching device:', response.statusText);
        }
      };

      fetchDevice();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchDeviceData = async () => {
        const response = await fetch(`http://139.59.54.184:8080/device/${id}/data/range/WEEK`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDeviceData(data);
        } else {
          console.error('Error fetching device data:', response.statusText);
        }
      };

      fetchDeviceData();
    }
  }, [id]);

  const handleDelete = () => {
    setOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://139.59.54.184:8080/device/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        // Device deleted successfully
        console.log('Device deleted successfully');
        router.back(); // Navigate back to the previous page
      } else {
        // Handle unsuccessful device deletion
        console.error('Error deleting device:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setOpen(false); // Close the confirmation modal
  };

  if (!device) {
    return <div>Loading...</div>;
  }

  const fieldNames = ['dissolvedOxygen', 'ph', 'waterTemperature', 'airTemperature', 'humidity', 'solarRadiation', 'solarEnergy', 'uvIndex'];

function getDayName(data, index) {
  const currentDayName = new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
  if (index > 0) {
    const previousDayName = new Date(deviceData[index - 1].timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    if (currentDayName === previousDayName) {
      return '';
    }
  }
  return currentDayName;
}

  return (
    <div>
      <Typography variant="h6" color="primary">
        Device Details
      </Typography>

      <p>Location Name: {device.locationName}</p>
      <p>Location Address: {device.locationAddress}</p>
      <p>Latitude: {device.latitude}</p>
      <p>Longitude: {device.longitude}</p>

      <Button variant="contained" color="primary" onClick={handleOpenEditModal}>
        Edit
      </Button>
      <Modal
        open={editDeviceOpen}
        onClose={handleCancelEditModal}
        aria-labelledby="edit-device-title"
        aria-describedby="edit-device-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-device-title">Edit Device</Typography>
          <Box marginBottom={2}>
            <TextField label="Location Name" value={editedLocationName} onChange={(e) => setEditedLocationName(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Location Address" value={editedLocationAddress} onChange={(e) => setEditedLocationAddress(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Latitude" value={editedLatitude} onChange={(e) => setEditedLatitude(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Longitude" value={editedLongitude} onChange={(e) => setEditedLongitude(e.target.value)} />
          </Box>
          <Button variant="contained" color="primary" onClick={handleConfirmEditModal}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancelEditModal}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Typography variant="h6" color="primary">
        Device Data
      </Typography>

      <Grid container spacing={2}>
        {fieldNames.map((field, index) => (
          <Grid item xs={6} key={index}>
            <Typography variant="h6">{field}</Typography>
            <Line
              data={{
                labels: deviceData.map((data, index) => getDayName(data, index)),
                datasets: [
                  {
                    label: field,
                    data: deviceData.map((data) => data[field]),
                    fill: false,
                    backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
                    borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    ticks: {
                      callback: function(value, index, values) {
                        return value.toFixed(2);
                      }
                    }
                  }
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this device?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Device;