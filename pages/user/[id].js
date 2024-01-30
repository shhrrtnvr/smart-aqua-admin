import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Modal, Box } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TextField } from '@mui/material';


const columns = [
  // { field: 'id', headerName: 'ID', width: 100 },
  { field: 'locationName', headerName: 'Location Name', width: 200 },
  { field: 'locationAddress', headerName: 'Location Address', width: 200 },
  { field: 'latitude', headerName: 'Latitude', width: 200 },
  { field: 'longitude', headerName: 'Longitude', width: 200 },
];

const User = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // State for modal visibility
  const [deleteUserId, setDeleteUserId] = useState(null); // State for storing the ID of the user to be deleted
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [updatedFirstName, setUpdatedFirstName] = useState(''); // State for updated first name
  const [updatedLastName, setUpdatedLastName] = useState(''); // State for updated last name
  const [updatedRole, setUpdatedRole] = useState(''); // State for updated role
  const [addDeviceOpen, setAddDeviceOpen] = useState(false); // State for add device modal visibility
  const [locationName, setLocationName] = useState(''); // State for location name
  const [locationAddress, setLocationAddress] = useState(''); // State for location address
  const [latitude, setLatitude] = useState(''); // State for latitude
  const [longitude, setLongitude] = useState(''); // State for longitude

  const handleOpenAddDevice = () => {
    setAddDeviceOpen(true);
  };

  const handleCancelAddDevice = () => {
    setLocationName('');
    setLocationAddress('');
    setLatitude('');
    setLongitude('');
    setAddDeviceOpen(false);
  };

  const handleConfirmAddDevice = async () => {
  try {
    const response = await fetch(`http://139.59.54.184:8080/device/add/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        locationName,
        locationAddress,
        latitude,
        longitude,
      }),
    });

    if (response.ok) {
      // Device added successfully
      console.log('Device added successfully');
      handleCancelAddDevice();
      // Fetch the updated list of devices
      const userResponse = await fetch(`http://139.59.54.184:8080/user/info/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (userResponse.ok) {
        const data = await userResponse.json();
        setUser(data);
      } else {
        console.error('Error fetching user:', userResponse.statusText);
      }
    } else {
      // Handle unsuccessful device addition
      console.error('Error adding device:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  const handleRowClick = (param) => {
    // Navigate to a new page with the details of the device
    router.push(`/device/${param.row.id}`);
  };

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const response = await fetch(`http://139.59.54.184:8080/user/info/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error fetching user:', response.statusText);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleEdit = async () => {
  if (editMode) {
    // If already in edit mode, call the update API
    try {
      const response = await fetch(`http://139.59.54.184:8080/auth/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          firstName: updatedFirstName,
          lastName: updatedLastName,
        }),
      });

      if (response.ok) {
        // User updated successfully
        console.log('User updated successfully');
        // Fetch the updated user details
        const userResponse = await fetch(`http://139.59.54.184:8080/user/info/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (userResponse.ok) {
          const data = await userResponse.json();
          setUser(data);
        } else {
          console.error('Error fetching user:', userResponse.statusText);
        }
      } else {
        // Handle unsuccessful user update
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Toggle edit mode
  setEditMode(!editMode);
};

const handleDelete = (id) => {
  setDeleteUserId(id); // Store the ID of the user to be deleted
  console.log(id);
  setOpen(true); // Open the confirmation modal
};

const handleConfirmDelete = async () => {
  try {
    const response = await fetch(`http://139.59.54.184:8080/user/delete/${deleteUserId}`, {
      method: 'POST', // Change this to POST
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.ok) {
      // User deleted successfully
      console.log('User deleted successfully');
      // Fetch the updated list of users
      const userListResponse = await fetch('http://139.59.54.184:8080/user/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (userListResponse.ok) {
        const data = await userListResponse.json();
        router.back();
      } else {
        console.error('Error fetching user list:', userListResponse.statusText);
      }
    } else {
      // Handle unsuccessful user deletion
      console.error('Error deleting user:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  setOpen(false); // Close the confirmation modal
};

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h6" color="primary">
        User Details
      </Typography>
      {editMode ? (
        <>
          <Box marginBottom={2}>
            <TextField label="Username" value={user.username} disabled />
          </Box>
          <Box marginBottom={2}>
            <TextField label="First Name" value={updatedFirstName} onChange={(e) => setUpdatedFirstName(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Last Name" value={updatedLastName} onChange={(e) => setUpdatedLastName(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <FormControl>
              <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={updatedRole}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                  sx={{ minWidth: 200 }} // Set a minimum width for the dropdown box
                >
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
            </FormControl>
          </Box>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <p>Username: {user.username}</p>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Role: {user.role}</p>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </>
      )}

      <Typography variant="h6" color="primary">
        Devices
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenAddDevice}>
        Add Device
      </Button>
       <Modal
        open={addDeviceOpen}
        onClose={handleCancelAddDevice}
        aria-labelledby="add-device-title"
        aria-describedby="add-device-description"
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
          <Typography id="add-device-title">Add Device</Typography>
          <Box marginBottom={2}>
            <TextField label="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Location Address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </Box>
          <Box marginBottom={2}>
            <TextField label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </Box>
          <Button variant="contained" color="primary" onClick={handleConfirmAddDevice}>
            Submit
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancelAddDevice}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={user.devices}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
          sortModel={[
            {
              field: 'id',
              sort: 'asc',
            },
          ]}
        />
      </div>

      <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>
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
            Are you sure you want to delete this user?
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

export default User;
