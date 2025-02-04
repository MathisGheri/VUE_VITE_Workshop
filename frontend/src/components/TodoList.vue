<template>
    <div class="container my-4">
      <h1 class="text-center mb-4">Ma Todo List</h1>
      
      <form @submit.prevent="addTask" class="mb-3">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Ajouter une tâche..."
            v-model="newTask"
            required
          />
          <button class="btn btn-primary" type="submit">Ajouter</button>
        </div>
      </form>
      
      <ul class="list-group">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center">
            <input
              type="checkbox"
              class="form-check-input me-2"
              :checked="task.completed"
              @change="toggleTask(task)"
            />
            <span :class="{ 'text-decoration-line-through': task.completed }">
              {{ task.title }}
            </span>
          </div>
          <button class="btn btn-danger btn-sm" @click="deleteTask(task.id)">
            Supprimer
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: "TodoList",
    data() {
      return {
        tasks: [],
        newTask: ""
      }
    },
    methods: {
      async fetchTasks() {
        try {
          const res = await axios.get("http://localhost:3000/tasks")
          this.tasks = res.data
        } catch (error) {
          console.error("Erreur lors de la récupération des tâches:", error)
        }
      },
      async addTask() {
        if (!this.newTask.trim()) return
        try {
          const res = await axios.post("http://localhost:3000/tasks", { title: this.newTask })
          this.tasks.push(res.data)
          this.newTask = ""
        } catch (error) {
          console.error("Erreur lors de l'ajout de la tâche:", error)
        }
      },
      async toggleTask(task) {
        try {
          const updated = { completed: !task.completed }
          await axios.put(`http://localhost:3000/tasks/${task.id}`, updated)
          task.completed = !task.completed
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la tâche:", error)
        }
      },
      async deleteTask(id) {
        try {
          await axios.delete(`http://localhost:3000/tasks/${id}`)
          this.tasks = this.tasks.filter(task => task.id !== id)
        } catch (error) {
          console.error("Erreur lors de la suppression de la tâche:", error)
        }
      }
    },
    mounted() {
      this.fetchTasks()
    }
  }
  </script>
  
  <style scoped>
  .text-decoration-line-through {
    text-decoration: line-through;
  }
  </style>
  