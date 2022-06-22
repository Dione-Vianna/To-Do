export type TaskProps = {
  id: string;
  title: string;
  checked: boolean;
  onDelete?: any; // use any porque ainda não saber como fazer o type para o onDelete
  onCheck?: any; // use any porque ainda não saber como fazer o type para o onCheck
};
