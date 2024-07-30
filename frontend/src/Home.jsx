import React, { useState } from 'react'
import Create from './Create'

const Home = () => {

    const [todos, setTodos] = useState([]);
  return (
    <div>
      <h2 className='text-blue-500'>ToDo List</h2>
      <Create />
        {
            todos.length === 0 ? 
            <div> No record </div> 
            :

            todos.map(todo => (
                <div>
                    {todo}
                </div>

            ))
        }
    </div>
  )
}

export default Home
