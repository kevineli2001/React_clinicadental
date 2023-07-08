// Server.js
const express = require("express");
const app = express();
var mysql = require("mysql2");
var cors = require("cors");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'admin',
  database: 'clinica_dental',
  port: 3306
});

app.use(cors());

// Ruta para registrar un nuevo paciente
app.post('/pacientes', (req, res) => {
  const { nombre } = req.body;
  console.log("NOMBRE ", nombre)
  const query = 'INSERT INTO Pacientes (Nombre) VALUES (?)';
  db.query(query, [nombre], (err, result) => {
    if (err) {
      console.error('Error al registrar el nuevo paciente:', err);
      res.status(500).json({ error: 'Error al registrar el nuevo paciente' });
      return;
    }
    res.json({ message: 'Nuevo paciente registrado correctamente' });
  });
});

// Ruta para programar una nueva cita
app.post('/citas', (req, res) => {
  const { idPaciente, idDentista, fecha } = req.body;
  const query = 'INSERT INTO Citas (ID_Paciente, ID_Dentista, Fecha) VALUES (?, ?, ?)';
  db.query(query, [idPaciente, idDentista, fecha], (err, result) => {
    if (err) {
      console.error('Error al programar la nueva cita:', err);
      res.status(500).json({ error: 'Error al programar la nueva cita' });
      return;
    }
    res.json({ message: 'Nueva cita programada correctamente' });
  });
});

// Ruta para obtener las citas programadas
app.get('/citas', (req, res) => {
  const query =
    'SELECT Citas.ID_Cita, Citas.Fecha, Pacientes.Nombre AS NombrePaciente, Dentistas.Nombre AS NombreDentista ' +
    'FROM Citas ' +
    'INNER JOIN Pacientes ON Citas.ID_Paciente = Pacientes.ID_Paciente ' +
    'INNER JOIN Dentistas ON Citas.ID_Dentista = Dentistas.ID_Dentista';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener las citas programadas:', err);
      res.status(500).json({ error: 'Error al obtener las citas programadas' });
      return;
    }
    res.json(result);
  });
});

// Ruta para cancelar una cita
app.delete('/citas/:id', (req, res) => {
  const idCita = req.params.id;
  const query = 'DELETE FROM Citas WHERE ID_Cita = ?';
  db.query(query, [idCita], (err, result) => {
    if (err) {
      console.error('Error al cancelar la cita:', err);
      res.status(500).json({ error: 'Error al cancelar la cita' });
      return;
    }
    res.json({ message: 'Cita cancelada correctamente' });
  });
});


// Ruta para obtener el listado de pacientes
app.get('/pacientes', (req, res) => {
  const query = 'SELECT * FROM Pacientes';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener el listado de pacientes:', err);
      res.status(500).json({ error: 'Error al obtener el listado de pacientes' });
      return;
    }
    res.json(result);
  });
});


// Ruta para obtener el listado de pacientes
app.get('/dentistas', (req, res) => {
  const query = 'SELECT * FROM Dentistas';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener el listado de pacientes:', err);
      res.status(500).json({ error: 'Error al obtener el listado de pacientes' });
      return;
    }
    res.json(result);
  });
});



var server = app.listen(3001, function () {
  console.log('Server is running..');
});
