let todos = [];

const createNewTodo = (req, res) => {
  const newTodo = {
    id: new Date().getTime(),
    title: `New Todo ${new Date().getTime()}`,
    completed: false,
  };
  todos.push(newTodo);
  res.json(todos);
};

const postNewTodo = (req, res) => {
  const newTodo = { ...req.body, id: new Date().getTime() };
  todos.push(newTodo);
  res.json(newTodo);
};

const removeTodo = (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id !== parseInt(id));
  res.json(todos);
};

const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
    return;
  }
  todos.splice(todoIndex, 1);
  res.sendStatus(200);
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
    return;
  }
  todos = todos.map((t) => {
    if (t.id === parseInt(id)) {
      return { ...t, ...req.body };
    }
    return t;
  });
  res.sendStatus(200);
};

export default function Lab5(app) {
  app.get("/lab5/todos/create", createNewTodo);
  app.post("/lab5/todos", postNewTodo);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
}
