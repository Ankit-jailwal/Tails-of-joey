export interface CreateManagerInput{
    name: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditManagerInputs {
    email : string;
    name : string;
    phone: string;
}
export interface ManagerLoginInput {
    email: string;
    password: string;
}

export interface ManagerPayload {
    _id: string;
    email: string;
    name: string;
}