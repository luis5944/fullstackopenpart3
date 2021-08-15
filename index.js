import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const BASE_URL = "/api/persons";

app.get(BASE_URL, (request, response) => {
  response.json(persons);
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
  const randomId = Math.floor(Math.random() * 10000) + 1;
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

  const person = {
    id: randomId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
