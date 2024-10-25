type UserProps = {
    id: string
    email: string
    password: string
}

export class User {
    constructor(public props: UserProps) {}
}