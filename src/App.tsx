import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { NotTask } from './components/NotTask';
import { Task } from './components/Task';

import { TaskProps } from './components/types';

import Logo from './assets/Logo.svg';
import Plus from './assets/Plus.svg';

function App() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [newTask, setNewTask] = useState<TaskProps>();

  function handleCreateTask() {
    if (newTask?.title === '') return;
    setTasks([...tasks, newTask] as TaskProps[]);
    const task = {
      title: '',
      id: '',
      checked: false,
    };
    setNewTask(task);
  }

  function handleAddTask(event: any) {
    const task = {
      title: event.target.value,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      checked: false,
    };

    setNewTask(task);
  }

  function handleCheckedTask(id: string) {
    const tasksChecked = tasks.map((task) => {
      if (task.id === id) {
        task.checked = !task.checked;
      }
      return task;
    });

    setTasks(tasksChecked);
  }

  const tasksCompleted = tasks.filter((task) => task.checked);

  return (
    <div className="App">
      <header className="header">
        <img src={Logo} alt="Logo todo" />
      </header>

      <div className="container">
        <div className="content-add">
          <input
            className="input-task"
            name="task"
            type="text"
            placeholder="Adicione uma nova tarefa"
            value={newTask?.title}
            onChange={handleAddTask}
          />
          <button className="button-add" onClick={handleCreateTask}>
            <p>Criar {'  '}</p>
            <img src={Plus} alt="Botão com símbolo de +" />
          </button>
        </div>
        <div className="content-task">
          <p className="created">
            Tarefas criadas <span className="completed">{tasks.length}</span>
          </p>
          <p className="done">
            Concluídas{' '}
            {tasks.length === 0 ? (
              <span className="completed">0</span>
            ) : (
              <span className="completed">
                {tasksCompleted.length} de {tasks.length}
              </span>
            )}
          </p>
        </div>
        <div>
          {tasks.length === 0 ? (
            <NotTask />
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="tasks">
                <Task
                  id={task.id}
                  title={task.title}
                  checked={task.checked}
                  onDelete={() =>
                    setTasks(tasks.filter((t) => t.id !== task.id))
                  }
                  onCheck={() => handleCheckedTask(task.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
