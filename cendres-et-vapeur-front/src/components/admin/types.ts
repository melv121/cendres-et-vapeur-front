export type Product = {
    id :string|number;
    price : number;
    stock : boolean;
    status : "ACTIVE"|"HIDEN";
}
export type User = {
    id :string|number;
    name : string; 
    email : string ;
    active : boolean;
    role :"USER"|"ADMIN";

 
}

export type SurvivorLog = {
  id: string | number;
  createdAt: string; 
  action: string;
  actor?: string;
};