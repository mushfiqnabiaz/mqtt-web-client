const express = require('express');
const mqtt = require('mqtt');
const sqlite3 = require('sqlite3');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.static('public')); // Serve the HTML file

// Create SQLite DB
const db = new sqlite3.Database('mqtt_data.db');

// Create table to store messages
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientId TEXT,
        direction TEXT,
        topic TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// MQTT Client Creation and Connection Route
app.post('/create-client', (req, res) => {
  const { clientId, broker, port, username, password, protocol } = req.body;
  let connectionUrl = '';

  // Create connection URL based on protocol
  switch(protocol) {
    case 'mqtt':
      connectionUrl = `mqtt://${broker}:${port}`;
      break;
    case 'mqtts':
      connectionUrl = `mqtts://${broker}:${port}`;
      break;
    case 'ws':
      connectionUrl = `ws://${broker}:${port}`;
      break;
    case 'wss':
      connectionUrl = `wss://${broker}:${port}`;
      break;
    default:
      connectionUrl = `mqtt://${broker}:${port}`;
  }

  const client = mqtt.connect(connectionUrl, { username, password });

  client.on('connect', () => {
    res.json({ status: 'connected' });
  });

  client.on('message', (topic, message) => {
    const direction = 'received';
    // Insert into database
    db.run("INSERT INTO messages (clientId, direction, topic, message) VALUES (?, ?, ?, ?)", [clientId, direction, topic, message.toString()]);

    // Emit the message to the frontend
    io.emit('mqtt_message', { direction, topic, message: message.toString() });
  });

  // Store the MQTT client globally for later use
  app.locals.client = client;
});

// Subscribe Route
app.post('/subscribe', (req, res) => {
  const { clientId, topic } = req.body;
  const client = app.locals.client;

  if (client) {
    client.subscribe(topic, (err) => {
      if (err) {
        return res.status(500).json({ status: 'Failed to subscribe' });
      }
      res.json({ status: 'Subscribed to topic' });
    });
  } else {
    res.status(500).json({ status: 'Client not connected' });
  }
});

// Send Message Route
app.post('/send-message', (req, res) => {
  const { clientId, topic, message } = req.body;
  const client = app.locals.client;

  if (client) {
    client.publish(topic, message);
    // Store the sent message in the database
    const direction = 'sent';
    db.run("INSERT INTO messages (clientId, direction, topic, message) VALUES (?, ?, ?, ?)", [clientId, direction, topic, message]);

    res.json({ status: 'Message sent' });
  } else {
    res.status(500).json({ status: 'Client not connected' });
  }
});

// Message History Route
app.get('/message-history/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  db.all("SELECT * FROM messages WHERE clientId = ? ORDER BY timestamp DESC", [clientId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Clear History Route
app.post('/clear-history', (req, res) => {
  const { clientId } = req.body;

  // Delete history from SQLite DB for the specific client
  db.run("DELETE FROM messages WHERE clientId = ?", [clientId], (err) => {
    if (err) {
      return res.status(500).json({ status: 'Failed to clear history' });
    }
    res.json({ status: 'Message history cleared' });
  });
});

// Start Server
http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
