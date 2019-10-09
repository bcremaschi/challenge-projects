const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.post("/projects", logRequests, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.post(
  "/projects/:id/tasks",
  logRequests,
  checkProjectInArray,
  (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const project = projects.find(project => project.id === id);

    project.tasks.push(title);

    return res.json(projects);
  }
);

server.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", logRequests, checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", logRequests, checkProjectInArray, (req, res) => {
  const { id } = req.params;

  index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.send(`Project ${id} deleted.`);
});

server.listen(3000);
