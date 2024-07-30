import React, { useState } from 'react'
import Create from './Create'
import Header from './pages/components/header';


const Home = () => {

    const [todos, setTodos] = useState([]);
  return (
    <>
    <Header/>
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
</>
  )
}

export default Home
