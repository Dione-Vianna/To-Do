import { TaskProps } from '../types';
import './style.css';

export function Task(props: TaskProps) {
  return (
    <div className="task">
      <input type="checkbox" className="check" onChange={props.onCheck} />
      <div className="task-title">
        {props.checked ? (
          <del className="title">{props.title}</del>
        ) : (
          <p className="title">{props.title}</p>
        )}
      </div>
      <button onClick={props.onDelete} className="trash" />
    </div>
  );
}
