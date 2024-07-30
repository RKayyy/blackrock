import React from 'react'
import axios from 'axios';
import { useState } from 'react';

const Create = () => {
  const [task, setTask] = useState();
  const handleAdd = () => {
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }
  
    axios.post('http://localhost:5555/add', { task: task })
      .then(result => {
        console.log(result);
        alert("Task added successfully!");
        setTask(''); // Clear the input field
      })
      .catch(err => {
        console.log(err);
        alert("Error adding task. Please try again.");
      });
  };
  
  return (
    <div>
      <input type="text" name="" id="" placeholder="Enter Task" onChange={(e)=> setTask(e.target.value)} />
      <button type='button' onClick={handleAdd}>Add</button>
    </div>
  )
}

export default Create
