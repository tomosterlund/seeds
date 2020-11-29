interface user {
    _id: string,
    courses?: [],
    joinDate?: string,
    imageUrl: string,
    name: string,
    email: string,
    password?: string,
    __v: number,
    language: string;
}

export default interface sessionUser {
    sessionUser: user
}