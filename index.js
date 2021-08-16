import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import Person from "./models/person.js";

dotenv.config();
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.use(cors());

let persons = [];

const BASE_URL = "/api/persons";

app.get(BASE_URL, (request, response) => {
  const findPersons = async () => {
    const result = await Person.find({});
    response.json(result.map((r) => r.toJSON()));
  };
  findPersons();
});

app.get("/info", (request, response) => {
  const info = `<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  </div>`;
  response.send(info);
});

app.get(`${BASE_URL}/:id`, (request, response) => {
  const id = +request.params.id;

  const person = persons.find((p) => p.id === id);
  if (!person) {
    response.status(404).end();
    return;
  }
  response.json(person);
});

app.delete(`${BASE_URL}/:id`, (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post(BASE_URL, (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  const exist = persons.find((p) => p.name === body.name);
  if (exist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savePerson) => {
    response.json(savePerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
