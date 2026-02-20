export type Role = "admin" | "viewer";

export type Session = {
    user: {
        email: string;
        role: Role;
    };
    token: string;
};