// Stations management functionality
document.addEventListener('DOMContentLoaded', () => {
  loadStations();
  setupForm();
});

function setupForm() {
  const form = document.getElementById('stationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleStationSubmit();
  });
}

async function handleStationSubmit() {
  const form = document.getElementById('stationForm');
  const formData = new FormData(form);
  const stationId = document.getElementById('stationId').value;
  const resultDiv = document.getElementById('formResult');
  
  const data = {
    name: formData.get('name'),
    operator: formData.get('operator') || null,
    address: formData.get('address'),
    latitude: parseFloat(formData.get('latitude')),
    longitude: parseFloat(formData.get('longitude')),
    ports: parseInt(formData.get('ports')) || 1,
    status: formData.get('status')
  };
  
  try {
    if (stationId) {
      // Update existing station
      await updateStation(stationId, data);
      resultDiv.innerHTML = '<p style="color: green;">Station updated successfully!</p>';
    } else {
      // Create new station
      await createStation(data);
      resultDiv.innerHTML = '<p style="color: green;">Station created successfully!</p>';
    }
    
    form.reset();
    document.getElementById('stationId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Station';
    document.getElementById('cancelBtn').style.display = 'none';
    await loadStations();
    
    setTimeout(() => {
      resultDiv.innerHTML = '';
    }, 3000);
  } catch (error) {
    console.error('Error saving station:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

async function loadStations() {
  try {
    const stations = await getStations();
    const container = document.getElementById('stationsList');
    
    if (stations.length === 0) {
      container.innerHTML = '<p>No stations found</p>';
      return;
    }
    
    let html = '<table><tr><th>ID</th><th>Name</th><th>Operator</th><th>Address</th><th>Ports</th><th>Status</th><th>Actions</th></tr>';
    stations.forEach(station => {
      html += `<tr>
        <td>${station.id}</td>
        <td>${station.name}</td>
        <td>${station.operator || 'N/A'}</td>
        <td>${station.address}</td>
        <td>${station.ports}</td>
        <td>${station.status}</td>
        <td>
          <button onclick="editStation(${station.id})">Edit</button>
          <button onclick="deleteStationConfirm(${station.id}, '${station.name}')">Delete</button>
        </td>
      </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading stations:', error);
    document.getElementById('stationsList').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function editStation(id) {
  try {
    const station = await getStation(id);
    const form = document.getElementById('stationForm');
    
    // Populate form with station data
    document.getElementById('stationId').value = station.id;
    form.querySelector('[name="name"]').value = station.name;
    form.querySelector('[name="operator"]').value = station.operator || '';
    form.querySelector('[name="address"]').value = station.address;
    form.querySelector('[name="latitude"]').value = station.latitude;
    form.querySelector('[name="longitude"]').value = station.longitude;
    form.querySelector('[name="ports"]').value = station.ports;
    form.querySelector('[name="status"]').value = station.status;
    
    // Change button text and show cancel
    document.getElementById('submitBtn').textContent = 'Update Station';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading station:', error);
    alert('Error loading station: ' + error.message);
  }
}

function cancelEdit() {
  const form = document.getElementById('stationForm');
  form.reset();
  document.getElementById('stationId').value = '';
  document.getElementById('submitBtn').textContent = 'Add Station';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('formResult').innerHTML = '';
}

async function deleteStationConfirm(id, name) {
  if (!confirm(`Are you sure you want to delete station "${name}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await deleteStation(id);
    alert('Station deleted successfully!');
    await loadStations();
  } catch (error) {
    console.error('Error deleting station:', error);
    alert('Error deleting station: ' + error.message);
  }
}

