import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  let { users } = db;

  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };
  const findAllUsers = () => users;
  const findUserById = (userId) => users.find(u => u._id === userId);
  const findUserByUsername = (username) => users.find(u => u.username === username);
  const findUserByCredentials = (username, password) =>
    users.find(u => u.username === username && u.password === password);
  const updateUser = (userId, user) =>
    users = users.map(u => (u._id === userId ? user : u));
  const deleteUser = (userId) =>
    users = users.filter(u => u._id !== userId);

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser
  };
}
