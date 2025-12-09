import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

   const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
   };
    app.post("/api/users", createUser);
  const deleteUser = async (req, res) => {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
  };
  app.delete("/api/users/:userId", deleteUser);
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
   app.get("/api/users/:userId", findUserById);

   const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
     req.session["currentUser"] = { ...currentUser, ...userUpdates };
   }
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = async (req, res) => {
    const exists = await dao.findUserByUsername(req.body.username);
    if (exists) return res.status(400).json({ message: "Username already in use" });
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ message: "Failed to create session" });
        } else {
          res.json(currentUser);
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

const profile = (req, res) => {
    let currentUser = req.session["currentUser"];
    if (!currentUser && req.query?.userId) {
      currentUser = dao.findUserById(req.query.userId);
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
