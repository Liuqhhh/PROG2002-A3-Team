const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testUpdateEvent() {
  try {
    console.log('🧪 Testing update event functionality...\n');

    // 1. First, get an existing event to see the current data
    console.log('1. Getting existing event...');
    const getResponse = await axios.get(`${API_BASE}/events/4`);
    console.log('✅ Current event data:', JSON.stringify(getResponse.data, null, 2));

    // 2. Test update with minimal data
    console.log('\n2. Testing update with minimal data...');
    const updateData = {
      title: 'Updated Marathon Event',
      description: 'This is an updated description for testing',
      event_date: '2025-10-01',
      event_time: '08:00:00',
      location: 'Updated Park Location',
      ticket_price: 30.00,
      available_tickets: 250,
      event_status: 'active',
      category: 'Sports'
    };

    try {
      const updateResponse = await axios.put(`${API_BASE}/admin/events/4`, updateData);
      console.log('✅ Update successful:', updateResponse.data);
    } catch (updateError) {
      console.log('❌ Update failed:');
      if (updateError.response) {
        console.log('   Status:', updateError.response.status);
        console.log('   Data:', updateError.response.data);
      } else {
        console.log('   Error:', updateError.message);
      }
    }

    // 3. Test with empty object to see if validation works
    console.log('\n3. Testing with empty object...');
    try {
      const emptyResponse = await axios.put(`${API_BASE}/admin/events/4`, {});
      console.log('✅ Empty object response:', emptyResponse.data);
    } catch (emptyError) {
      console.log('❌ Empty object failed:');
      if (emptyError.response) {
        console.log('   Status:', emptyError.response.status);
        console.log('   Data:', emptyError.response.data);
      } else {
        console.log('   Error:', emptyError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Install axios if not already installed: npm install axios
testUpdateEvent();