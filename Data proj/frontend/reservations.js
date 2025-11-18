// Reservations functionality
document.addEventListener('DOMContentLoaded', () => {
  loadFutureReservations();
  loadAllReservations();
  setupForm();
  loadUsers();
  loadChargers();
});

function setupForm() {
  const form = document.getElementById('reservationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleReservationSubmit();
  });
}

async function loadUsers() {
  try {
    const users = await getUsers();
    const select = document.getElementById('userId');
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.user_id;
      option.textContent = `${user.fname} ${user.lname} (${user.email})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadChargers() {
  try {
    // Get available chargers from resources view
    const resources = await getView('resources');
    const chargers = resources.filter(r => r.resource_type === 'Charger' && r.status === 'Available');
    
    const select = document.getElementById('chargerId');
    chargers.forEach(charger => {
      const option = document.createElement('option');
      option.value = charger.resource_id;
      option.textContent = charger.label;
      select.appendChild(option);
    });
    
    // If no available chargers, try getting all stations and chargers
    if (chargers.length === 0) {
      const stations = await getStations();
      // Note: We'd need a chargers API endpoint to get full charger details
      // For now, show stations as placeholder
      stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.id;
        option.textContent = `${station.name} - Station ID: ${station.id}`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading chargers:', error);
  }
}

async function handleReservationSubmit() {
  const form = document.getElementById('reservationForm');
  const formData = new FormData(form);
  const reservationId = document.getElementById('reservationId').value;
  const resultDiv = document.getElementById('formResult');
  
  const startTime = formData.get('startt');
  const endTime = formData.get('endt');
  
  // Convert datetime-local to MySQL datetime format
  const startt = new Date(startTime).toISOString().slice(0, 19).replace('T', ' ');
  const endt = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');
  
  const data = {
    user_id: parseInt(formData.get('user_id')),
    charger_id: parseInt(formData.get('charger_id')),
    startt: startt,
    endt: endt,
    status: formData.get('status') || 'Reserved'
  };
  
  try {
    // Note: This will need a reservation API endpoint
    // For now, show a message that backend API is needed
    resultDiv.innerHTML = '<p style="color: orange;">Reservation API endpoint not yet implemented. Backend route needed: POST /api/reservations</p>';
    
    // When API is available, uncomment this:
    /*
    if (reservationId) {
      await updateReservation(reservationId, data);
      resultDiv.innerHTML = '<p style="color: green;">Reservation updated successfully!</p>';
    } else {
      await createReservation(data);
      resultDiv.innerHTML = '<p style="color: green;">Reservation created successfully!</p>';
    }
    
    form.reset();
    document.getElementById('reservationId').value = '';
    document.getElementById('submitBtn').textContent = 'Create Reservation';
    document.getElementById('cancelBtn').style.display = 'none';
    await loadFutureReservations();
    await loadAllReservations();
    */
  } catch (error) {
    console.error('Error saving reservation:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

async function loadFutureReservations() {
  try {
    const reservations = await getView('future-res-details');
    const container = document.getElementById('futureReservations');
    
    if (reservations.length === 0) {
      container.innerHTML = '<p>No future reservations found</p>';
      return;
    }
    
    let html = '<table><tr><th>Reservation ID</th><th>User</th><th>Station</th><th>Connector Type</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Actions</th></tr>';
    reservations.forEach(res => {
      html += `<tr>
        <td>${res.res_id}</td>
        <td>${res.fname || ''} ${res.lname || ''}</td>
        <td>${res.station_name || 'N/A'}</td>
        <td>${res.connector_type || 'N/A'}</td>
        <td>${formatDateTime(res.startt)}</td>
        <td>${formatDateTime(res.endt)}</td>
        <td>${res.status}</td>
        <td>
          <button onclick="cancelReservation(${res.res_id}, '${res.status}')">Cancel</button>
        </td>
      </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading future reservations:', error);
    document.getElementById('futureReservations').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function loadAllReservations() {
  try {
    const reservations = await getView('reservations-session');
    const container = document.getElementById('allReservations');
    
    if (reservations.length === 0) {
      container.innerHTML = '<p>No reservations found</p>';
      return;
    }
    
    let html = '<table><tr><th>Reservation ID</th><th>User ID</th><th>Charger ID</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Has Session</th></tr>';
    reservations.forEach(res => {
      html += `<tr>
        <td>${res.res_id}</td>
        <td>${res.user_id}</td>
        <td>${res.charger_id}</td>
        <td>${formatDateTime(res.startt)}</td>
        <td>${formatDateTime(res.endt)}</td>
        <td>${res.status}</td>
        <td>${res.has_session ? 'Yes' : 'No'}</td>
      </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading all reservations:', error);
    document.getElementById('allReservations').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return 'N/A';
  const date = new Date(dateTimeString);
  return date.toLocaleString();
}

function cancelEdit() {
  const form = document.getElementById('reservationForm');
  form.reset();
  document.getElementById('reservationId').value = '';
  document.getElementById('submitBtn').textContent = 'Create Reservation';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('formResult').innerHTML = '';
  loadUsers();
  loadChargers();
}

async function cancelReservation(resId, currentStatus) {
  if (currentStatus === 'Cancelled') {
    alert('This reservation is already cancelled.');
    return;
  }
  
  if (!confirm('Are you sure you want to cancel this reservation?')) {
    return;
  }
  
  try {
    // Note: This will need a reservation API endpoint
    alert('Cancel reservation API endpoint not yet implemented. Backend route needed: PUT /api/reservations/:id with status=Cancelled');
    
    // When API is available, uncomment this:
    /*
    await updateReservation(resId, { status: 'Cancelled' });
    alert('Reservation cancelled successfully!');
    await loadFutureReservations();
    await loadAllReservations();
    */
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    alert('Error cancelling reservation: ' + error.message);
  }
}

