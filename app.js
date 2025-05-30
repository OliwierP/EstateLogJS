const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const logStream = fs.createWriteStream('api.log', { flags: 'a' });
const client = require('prom-client');
const path = require('path'); 

const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register }); // Collects default Node.js metrics (CPU, memory, etc.)

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // Buckets for response time from 0.1s to 10s
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});
register.registerMetric(httpRequestsTotal);

const appErrorsTotal = new client.Counter({
  name: 'app_errors_total',
  help: 'Total number of application errors',
  labelNames: ['route', 'error_type']
});
register.registerMetric(appErrorsTotal);

const appUptime = new client.Gauge({
    name: 'app_uptime_seconds',
    help: 'Application uptime in seconds',
    async collect() {
        this.set(process.uptime());
    }
});
register.registerMetric(appUptime);

app.use(cors());
//app.use(express.static('public'));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'api'
});

// 1. Inicjalizacja systemu logowania
let errorCount = 0;
let requestCount = 0;

app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  res.on('finish', () => {
    const durationSeconds = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.url; // Get route pattern if available

    requestCount++;

    // Prometheus metrics
    httpRequestsTotal.labels(req.method, route, res.statusCode).inc();
    httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode).observe(durationSeconds);

    // log entry
    const LogEntry = `[${new Date().toISOString()}] IP: ${ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationSeconds * 1000}ms\n`;
    logStream.write(LogEntry);
  });

  next();
});

app.use(express.static(path.join(__dirname, 'prezentacja')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'prezentacja', 'index.html'));
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    appErrorsTotal.labels('/metrics', 'scrape_error').inc();
    res.status(500).end(ex.toString());
  }
});

// 2. Endpointy do monitorowania logów
app.get('/monitoring/logs', (req, res) => {
  fs.readFile('api.log', 'utf8', (err, data) => {
    if (err) {
      errorCount++;
      appErrorsTotal.labels('/monitoring/logs', 'read_error').inc();
      return res.status(500).json({ error: 'Cannot read logs' });
    }
    res.type('text/plain').send(data);
  });
});

app.get('/monitoring/stats', (req, res) => {
  res.json({
    uptime: process.uptime(),
    totalRequests: requestCount,
    totalErrors: errorCount,
    lastUpdated: new Date().toISOString()
  });
});

app.get('/error-test', (req, res, next) => {
  next(new Error('Testowy błąd!'));
});

// Globalny middleware do obsługi błędów
app.use((err, req, res, next) => {
  errorCount++;
  const route = req.route ? req.route.path : req.url;
  appErrorsTotal.labels(route, 'unhandled_error').inc();
  logStream.write(`[CRITICAL] ${new Date().toISOString()} Unhandled error: ${route}\n`);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/agents', (req, res) => {
  const query = 'SELECT * FROM agents';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving agents: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc(); // Example specific error metric
      res.status(500).send('Error retrieving agents');
      return;
    }
    res.status(200).json(results);
  });
});

app.post('/agents', (req, res) => {
  const { firstName, lastName, phone, email, position } = req.body;
  const query = 'INSERT INTO agents (first_name, last_name, phone, email, position) VALUES (?, ?, ?, ?, ?)';
  const values = [firstName, lastName, phone, email, position];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating a new agent: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error creating a new agent');
      return;
    }
    const newAgentId = results.insertId;
    res.status(201).json({ id: newAgentId, ...req.body });
  });
});

app.get('/agents/:id', (req, res) => {
  const query = 'SELECT * FROM agents WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching agent: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error fetching agent');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Agent not found');
    } else {
      res.json(results[0]);
    }
  });
});

app.put('/agents/:id', (req, res) => {
  const agentId = req.params.id;
  const { firstName, lastName, phone, email, position } = req.body;
  const query = 'UPDATE agents SET first_name = ?, last_name = ?, phone = ?, email = ?, position = ? WHERE id = ?';
  const values = [firstName, lastName, phone, email, position, agentId];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating agent: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error updating agent');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Agent not found');
    } else {
      res.status(200).json({ id: agentId, firstName, lastName, phone, email, position });
    }
  });
});

app.delete('/agents/:id', (req, res) => {
  const agentId = req.params.id;
  const query = 'DELETE FROM agents WHERE id = ?';
  connection.query(query, [agentId], (err, results) => {
    if (err) {
      console.error('Error deleting agent: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error deleting agent');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Agent not found');
    } else {
      res.status(200).send('Agent deleted successfully');
    }
  });
});

app.post('/clients', (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  const query = 'INSERT INTO clients (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)';
  const values = [firstName, lastName, phone, email];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating a new client: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error creating a new client');
      return;
    }
    const newClientId = results.insertId;
    res.status(201).json({ id: newClientId, ...req.body });
  });
});

app.get('/clients', (req, res) => {
  const query = 'SELECT * FROM clients';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching clients: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error fetching clients');
      return;
    }
    res.json(results);
  });
});

app.get('/clients/:id', (req, res) => {
  const query = 'SELECT * FROM clients WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching client: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error fetching client');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Client not found');
    } else {
      res.json(results[0]);
    }
  });
});

app.put('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  const { firstName, lastName, phone, email } = req.body;
  const query = 'UPDATE clients SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?';
  const values = [firstName, lastName, phone, email, clientId];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating client: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error updating client');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Client not found');
    } else {
      res.status(200).json({ id: clientId, firstName, lastName, phone, email });
    }
  });
});

app.delete('/clients/:id', (req, res) => {
  const query = 'DELETE FROM clients WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error deleting client: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error deleting client');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Client not found');
    } else {
      res.sendStatus(204);
    }
  });
});

app.get('/estates', (req, res) => {
  const query = 'SELECT * FROM estates';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching estates: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error fetching estates');
      return;
    }
    res.json(results);
  });
});

app.get('/estates/:id', (req, res) => {
  const estateId = req.params.id;
  const query = 'SELECT * FROM estates WHERE id = ?';
  connection.query(query, [estateId], (err, results) => {
    if (err) {
      console.error('Error fetching estate: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error fetching estate');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Estate not found');
    } else {
      res.json(results[0]);
    }
  });
});

app.post('/estates', (req, res) => {
  const { name, address, price, is_bought } = req.body;
  const query = 'INSERT INTO estates (name, address, price, is_bought) VALUES (?, ?, ?, ?)';
  const values = [name, address, price, is_bought];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating a new estate: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error creating a new estate');
      return;
    }
    const newEstateId = results.insertId;
    res.status(201).json({ id: newEstateId, ...req.body });
  });
});

app.put('/estates/:id', (req, res) => {
  const estateId = req.params.id;
  const { name, address, price, is_bought } = req.body;
  const query = 'UPDATE estates SET name = ?, address = ?, price = ?, is_bought = ? WHERE id = ?';
  const values = [name, address, price, is_bought, estateId];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating the estate: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error updating the estate');
      return;
    }
    if (results.affectedRows === 0) { // Check if any row was actually updated
        res.status(404).send('Estate not found or data is the same');
    } else {
        res.status(200).json({ id: estateId, ...req.body });
    }
  });
});

app.delete('/estates/:id', (req, res) => {
  const estateId = req.params.id;
  const query = 'DELETE FROM estates WHERE id = ?';
  connection.query(query, [estateId], (err, results) => {
    if (err) {
      console.error('Error deleting the estate: ', err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      res.status(500).send('Error deleting the estate');
      return;
    }
    if (results.affectedRows === 0) {
        res.status(404).send('Estate not found');
    } else {
        res.status(200).json({ id: estateId, message: 'Estate deleted successfully' });
    }
  });
});


app.get('/transactions', (req, res) => {
  const sql = 'SELECT * FROM transactions';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

app.get('/transactions/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM transactions WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result[0]);
  });
});

// Helper function for transaction foreign key checks
const checkForeignKey = (query, value, errorMessage, callback) => {
  connection.query(query, [value], (err, result) => {
    if (err) {
      console.error(err);
      callback({ status: 500, error: 'Internal server error (foreign key check)' });
    } else if (result.length === 0) {
      callback({ status: 400, error: errorMessage });
    } else {
      callback(null); // No error
    }
  });
};

app.post('/transactions', (req, res) => {
  const { client_id, agent_id, estate_id, date, state } = req.body;
  const routePath = req.route.path;

  checkForeignKey('SELECT id FROM agents WHERE id = ?', agent_id, 'Agent does not exist', (err) => {
    if (err) return res.status(err.status).json({ error: err.error });
    checkForeignKey('SELECT id FROM clients WHERE id = ?', client_id, 'Client does not exist', (err) => {
      if (err) return res.status(err.status).json({ error: err.error });
      checkForeignKey('SELECT id FROM estates WHERE id = ?', estate_id, 'Estate does not exist', (err) => {
        if (err) return res.status(err.status).json({ error: err.error });

        const sql = 'INSERT INTO transactions (client_id, agent_id, estate_id, date, state) VALUES (?, ?, ?, ?, ?)';
        const values = [client_id, agent_id, estate_id, date, state];
        connection.query(sql, values, (dbErr, result) => {
          if (dbErr) {
            console.error(dbErr);
            appErrorsTotal.labels(routePath, 'db_error_insert').inc();
            return res.status(500).json({ error: 'Internal server error on insert' });
          }
          res.status(201).json({ id: result.insertId, message: 'Transaction added successfully' });
        });
      });
    });
  });
});

app.put('/transactions/:id', (req, res) => {
  const id = req.params.id;
  const { client_id, agent_id, estate_id, date, state } = req.body;
  const routePath = req.route.path;

  checkForeignKey('SELECT id FROM agents WHERE id = ?', agent_id, 'Agent does not exist', (err) => {
    if (err) return res.status(err.status).json({ error: err.error });
    checkForeignKey('SELECT id FROM clients WHERE id = ?', client_id, 'Client does not exist', (err) => {
      if (err) return res.status(err.status).json({ error: err.error });
      checkForeignKey('SELECT id FROM estates WHERE id = ?', estate_id, 'Estate does not exist', (err) => {
        if (err) return res.status(err.status).json({ error: err.error });

        const sql = 'UPDATE transactions SET client_id = ?, agent_id = ?, estate_id = ?, date = ?, state = ? WHERE id = ?';
        const values = [client_id, agent_id, estate_id, date, state, id];
        connection.query(sql, values, (dbErr, result) => {
          if (dbErr) {
            console.error(dbErr);
            appErrorsTotal.labels(routePath, 'db_error_update').inc();
            return res.status(500).json({ error: 'Internal server error on update' });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found or data is the same' });
          }
          res.json({ message: 'Transaction updated successfully' });
        });
      });
    });
  });
});

app.delete('/transactions/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM transactions WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      appErrorsTotal.labels(req.route.path, 'db_error').inc();
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Metrics available at http://localhost:${port}/metrics`);
});