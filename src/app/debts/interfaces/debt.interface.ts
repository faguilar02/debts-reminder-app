export interface Debt {
  id?:string,
  code: string;
  company: string;
  amount: number;
  dueDate: string;
  color: string;
  state: string
  userId:string
}
