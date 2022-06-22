import Clipboard from '../../assets/Clipboard.svg';
import './style.css';

export function NotTask() {
  return (
    <div className="not-task">
      <img src={Clipboard} alt="" />
      <p className="not-task-text">Você ainda não tem tarefas cadastradas</p>
      <span className="not-task-span">
        Crie tarefas e organize seus itens a fazer
      </span>
    </div>
  );
}
