// {
//     "email": "testimport2",
//     "code": "testimport2",
//     "firstName": "testimport2",
//     "lastName": "testimport2",
//     "username": "testimport2",
//     "department": 0,
//     "phone": "testimport2"
// }


export default interface UserCreateByManagerCommand {
    email: string;
    code: string;
    firstname: string;
    lastname: string;
    username: string;
    department: number | null;
    phone: string | null;
}