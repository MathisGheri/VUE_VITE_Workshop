const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'todo_user',
  password: 'secret',
  database: 'todo_db',
  port: 3306
});

db.getConnection((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL !');
});

/* ROUTES CRUD */
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Le champ title est requis.' });
  }

  const sql = 'INSERT INTO tasks (title) VALUES (?)';
  db.query(sql, [title], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    return res.status(201).json({ id: result.insertId, title, completed: 0 });
  });
});

app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des tâches:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    return res.status(200).json(rows);
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  let updateFields = [];
  let values = [];

  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (completed !== undefined) {
    updateFields.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  values.push(id);

  const sql = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }
    return res.status(200).json({ message: 'Tâche mise à jour avec succès' });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }
    return res.status(200).json({ message: 'Tâche supprimée avec succès' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
