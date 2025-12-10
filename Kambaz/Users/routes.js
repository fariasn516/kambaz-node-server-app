import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

   const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    const userObj = user.toObject ? user.toObject() : user;
    res.json(userObj);
   };
    app.post("/api/users", createUser);
  const deleteUser = async (req, res) => {
      const result = await dao.deleteUser(req.params.userId);
      if (result) {
        res.json({ success: true, deleted: req.params.userId });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
  };
  app.delete("/api/users/:userId", deleteUser);
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      const usersArray = Array.isArray(users) ? users.map(u => u.toObject ? u.toObject() : u) : users;
      res.json(usersArray);
      return;
    }if (name) {
      const users = await dao.findUsersByPartialName(name);
      const usersArray = Array.isArray(users) ? users.map(u => u.toObject ? u.toObject() : u) : users;
      res.json(usersArray);
      return;
    }
    const users = await dao.findAllUsers();
    const usersArray = Array.isArray(users) ? users.map(u => u.toObject ? u.toObject() : u) : users;
    res.json(usersArray);
  };
  app.get("/api/users", findAllUsers);
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    const userObj = user?.toObject ? user.toObject() : user;
    res.json(userObj);
  };
   app.get("/api/users/:userId", findUserById);

   const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    // Fetch and return the updated user
    const updatedUser = await dao.findUserById(userId);
    const userObj = updatedUser?.toObject ? updatedUser.toObject() : updatedUser;
    
    // Update session if this is the current user
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = userObj;
    }
    
    res.json(userObj);
  };

  const signup = async (req, res) => {
    const exists = await dao.findUserByUsername(req.body.username);
    if (exists) return res.status(400).json({ message: "Username already in use" });
    const currentUser = await dao.createUser(req.body);
    const userObj = currentUser.toObject ? currentUser.toObject() : currentUser;
    req.session["currentUser"] = userObj;
    res.json(userObj);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      const userObj = currentUser.toObject ? currentUser.toObject() : currentUser;
      req.session["currentUser"] = userObj;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ message: "Failed to create session" });
        } else {
          res.json(userObj);
        }
      });
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

const profile = async (req, res) => {
    let currentUser = req.session["currentUser"];
    if (!currentUser && req.query?.userId) {
      currentUser = await dao.findUserById(req.query.userId);
      if (currentUser) {
        currentUser = currentUser.toObject ? currentUser.toObject() : currentUser;
      }
    }
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
