import { useEffect, useState } from 'react';
import './App.css';
import { NotTask } from './components/NotTask';
import { Task } from './components/Task';

import './modal.css';

import { NewTaskProps, TaskProps } from './components/types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Logo from './assets/Logo.svg';
import Plus from './assets/Plus.svg';

import api from './api';

function App() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [newTask, setNewTask] = useState<NewTaskProps>({
    title: '',
    completed: false,
  });

  // const [characters, setCharacters] = useState<TaskProps[]>(tasks);

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState('');

  const [modalShow, setModalShow] = useState(false);

  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    api.get('/').then((response) => {
      console.log(response.data);
      setTasks(response.data);
    });
  }, []);

  function handleCreateTask() {
    if (newTask?.title === '') return;
    setLoading(true);

    api
      .post('/', newTask)
      .then((response) => {
        console.log(response.data);
        setTasks([
          ...tasks,
          { _id: response.data.insertedId, ...newTask },
        ] as TaskProps[]);
        setNewTask({ title: '', completed: false });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleAddTask(event: any) {
    const task = {
      title: event.target.value,
      completed: false,
    };

    setNewTask(task);
  }

  function handleCheckedTask(id: string) {
    const task = tasks.find((task) => task._id === id);
    if (!task) return;

    const tasksChecked = tasks.map((task) => {
      if (task._id === id) {
        task.completed = !task.completed;

        console.log(task);

        api
          .put(`/${id}`, {
            completed: task.completed,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        return task;
      }
      return task;
    });

    setTasks(tasksChecked);
  }

  function handleDelete() {
    const tasksDeleted = tasks.filter((task) => task._id !== id);

    api
      .delete(`/${id}`)
      .then((response) => {
        console.log(response.data);
        setTasks(tasksDeleted);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const stopProp = (e: any) => {
    e.stopPropagation();
  };

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;

    console.log(tasks);

    const items: any = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    setNewTask(items);
  }

  const LoginOverlay = ({ removeOverlay }: any) => {
    return (
      <div className="overlay_background" onClick={(e) => removeOverlay()}>
        <div className="overlay_card" onClick={(e) => stopProp(e)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              removeOverlay();
            }}
          >
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Excluir tarefa</h2>
                </div>
                <div className="modal-body">
                  <p>Tem certeza de que deseja excluir esta tarefa?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel">Cancel</button>
                  <button className="btn-delete" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  function ModalDelete() {
    return (
      <div className="flex_column">
        <div className={overlay ? 'overlay_shown' : 'overlay_hidden'}>
          <LoginOverlay removeOverlay={() => setOverlay(false)} />
        </div>
      </div>
    );
  }

  function handleDeleteTask(id: string) {
    setId(id);
    setModalShow(true);
    setOverlay(true);
  }

  const tasksCompleted = tasks.filter((task) => task.completed);

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
          <button
            className="button-add"
            disabled={loading}
            onClick={handleCreateTask}
          >
            {loading ? (
              <>
                <p>Aguarde...</p>
              </>
            ) : (
              <>
                <p>Criar {'  '}</p>
                <img src={Plus} alt="Botão com símbolo de +" />
              </>
            )}
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
            // tasks.map((task) => (
            //   <div key={task._id} className="tasks">
            //     <Task
            //       _id={task._id}
            //       title={task.title}
            //       completed={task.completed}
            //       onDelete={() => handleDeleteTask(task._id)}
            //       onCheck={() => handleCheckedTask(task._id)}
            //     />
            //   </div>
            // ))

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.map((task, index) => {
                      return (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="tasks">
                                <Task
                                  _id={task._id}
                                  title={task.title}
                                  completed={task.completed}
                                  onDelete={() => handleDeleteTask(task._id)}
                                  onCheck={() => handleCheckedTask(task._id)}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
      {modalShow && <ModalDelete />}
    </div>
  );
}

export default App;
