export type TaskProps = {
  _id: string;
  title: string;
  completed: boolean;
  onDelete?: any; // use any porque ainda não saber como fazer o type para o onDelete
  onCheck?: any; // use any porque ainda não saber como fazer o type para o onCheck
};

export type NewTaskProps = {
  title: string;
  completed: boolean;
};
