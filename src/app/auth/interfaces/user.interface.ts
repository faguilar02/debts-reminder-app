import { Debt } from "../../debts/interfaces/debt.interface";

export interface User {

  id:string;
  username:string;
  email:string;
  password:string
  debts?: Debt[]
}
