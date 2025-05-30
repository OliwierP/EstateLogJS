const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();


app.use(cors());

app.use(express.static('public'));


const metricsMiddleware = promBundle({
  includeMethod: true,      
  includePath: true,          
  includeStatusCode: true,   
  normalizePath: true       
});
app.use(metricsMiddleware);

app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'api'
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
      res.status(500).send('Error updating the estate');
      return;
    }
    res.status(200).json({ id: estateId, ...req.body });
  });
});

app.delete('/estates/:id', (req, res) => {
  const estateId = req.params.id;
  const query = 'DELETE FROM estates WHERE id = ?';
  connection.query(query, [estateId], (err, results) => {
    if (err) {
      console.error('Error deleting the estate: ', err);
      res.status(500).send('Error deleting the estate');
      return;
    }
    res.status(200).json({ id: estateId, message: 'Estate deleted successfully' });
  });
});


app.get('/transactions', (req, res) => {
  const sql = 'SELECT * FROM transactions';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
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
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result[0]);
  });
});

app.post('/transactions', (req, res) => {
  const { client_id, agent_id, estate_id, date, state } = req.body;
  const agentCheckQuery = 'SELECT id FROM agents WHERE id = ?';
  connection.query(agentCheckQuery, [agent_id], (err, agentResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'External server error' });
    }
    if (agentResult.length === 0) {
      return res.status(400).json({ error: 'Agent does not exist' });
    }
    const clientCheckQuery = 'SELECT id FROM clients WHERE id = ?';
    connection.query(clientCheckQuery, [client_id], (err, clientResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (clientResult.length === 0) {
        return res.status(400).json({ error: 'Client does not exist' });
      }
      const estateCheckQuery = 'SELECT id FROM estates WHERE id = ?';
      connection.query(estateCheckQuery, [estate_id], (err, estateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (estateResult.length === 0) {
          return res.status(400).json({ error: 'Estate does not exist' });
        }
        const sql = 'INSERT INTO transactions (client_id, agent_id, estate_id, date, state) VALUES (?, ?, ?, ?, ?)';
        const values = [client_id, agent_id, estate_id, date, state];
        connection.query(sql, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          res.json({ message: 'Transaction added successfully' });
        });
      });
    });
  });
});

app.put('/transactions/:id', (req, res) => {
  const id = req.params.id;
  const { client_id, agent_id, estate_id, date, state } = req.body;
  const checkQuery = 'SELECT id FROM agents WHERE id = ?';
  connection.query(checkQuery, [agent_id], (err, agentResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (agentResult.length === 0) {
      return res.status(400).json({ error: 'Agent does not exist' });
    }
    const checkQuery = 'SELECT id FROM clients WHERE id = ?';
    connection.query(checkQuery, [client_id], (err, clientResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (clientResult.length === 0) {
        return res.status(400).json({ error: 'Client does not exist' });
      }
      const checkQuery = 'SELECT id FROM estates WHERE id = ?';
      connection.query(checkQuery, [estate_id], (err, estateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (estateResult.length === 0) {
          return res.status(400).json({ error: 'Estate does not exist' });
        }
        const sql = 'UPDATE transactions SET client_id = ?, agent_id = ?, estate_id = ?, date = ?, state = ? WHERE id = ?';
        const values = [client_id, agent_id, estate_id, date, state, id];
        connection.query(sql, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
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
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});