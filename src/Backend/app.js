const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hsgaargauost',
  database: 'krankenhausdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function startServer() {
  const server = http.createServer(app);
  let port = process.env.PORT || 5000;

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} ist bereits in Verwendung. Versuche es mit einem anderen Port.`);
      port++;
      server.listen(port);
    }
  });

  server.on('listening', () => {
    console.log(`Server läuft auf Port ${port}`);
  });

  server.listen(port);
}

function queryDatabase(query, params, res) {
  pool.execute(query, params, (queryErr, results) => {
    if (queryErr) {
      console.error('Fehler bei der Abfrage: ', queryErr);
      res.status(500).json({ error: 'Fehler bei der Abfrage' });
    } else {
      res.json(results);
    }
  });
}

// CRUD-Operationen für Patienten

app.post('/patienten', (req, res) => {
  const { Name, Geburtsdatum, Geschlecht } = req.body;
  if (!Name || !Geburtsdatum || !Geschlecht) {
    return res.status(400).json({ error: 'Fehlende Daten' });
  }
  const query = 'INSERT INTO Patienten (Name, Geburtsdatum, Geschlecht) VALUES (?, ?, ?)';
  queryDatabase(query, [Name, Geburtsdatum, Geschlecht], res);
});

app.put('/patienten/:id', (req, res) => {
  const { Name, Geburtsdatum, Geschlecht } = req.body;
  const patientId = req.params.id;
  if (!Name || !Geburtsdatum || !Geschlecht) {
    return res.status(400).json({ error: 'Fehlende Daten' });
  }
  const query = 'UPDATE Patienten SET Name=?, Geburtsdatum=?, Geschlecht=? WHERE PatientID=?';
  queryDatabase(query, [Name, Geburtsdatum, Geschlecht, patientId], res);
});

app.delete('/patienten/:id', (req, res) => {
  const patientId = req.params.id;
  const query = 'DELETE FROM Patienten WHERE PatientID=?';
  queryDatabase(query, [patientId], res);
});

// GET-Operationen

app.get('/patienten', (req, res) => {
  const query = 'SELECT * FROM Patienten';
  queryDatabase(query, [], res);
});

app.get('/login', (req, res) => {
  const query = 'SELECT * FROM login';
  queryDatabase(query, [], res);
});

app.get('/arzte', (req, res) => {
  const query = 'SELECT * FROM Ärzte';
  queryDatabase(query, [], res);
});

app.get('/abteilungen', (req, res) => {
  const query = 'SELECT * FROM Abteilungen';
  queryDatabase(query, [], res);
});

app.get('/zimmer', (req, res) => {
  const query = 'SELECT * FROM Zimmer';
  queryDatabase(query, [], res);
});

app.get('/behandlungen', (req, res) => {
  const query = 'SELECT * FROM Behandlungen';
  queryDatabase(query, [], res);
});

app.get('/behandlungen_patienten', (req, res) => {
  const query = 'SELECT * FROM Behandlungen_Patienten';
  queryDatabase(query, [], res);
});

app.get('/behandlungen_arzte', (req, res) => {
  const query = 'SELECT * FROM Behandlungen_Ärzte';
  queryDatabase(query, [], res);
});

// Starte den Server
startServer();

module.exports = app;
