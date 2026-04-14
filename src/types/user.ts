export interface User {
    user_id: string;
    ditech_id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_role: "admin" | "maintenance";
}