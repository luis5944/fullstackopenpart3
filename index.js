import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import Person from "./models/person.js";

const app = express();
dotenv.config();
app.use(cors());
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


const BASE_URL = "/api/persons";

app.get(BASE_URL, (request, response) => {
	const findPersons = async () => {
		const result = await Person.find({});
		response.json(result.map((r) => r.toJSON()));
	};
	findPersons();
});

app.get("/info", (request, response) => {
	Person.find({}).then((p) => {
		const info = `<div>
    <p>Phonebook has info for ${p.length} people</p>
    <p>${new Date()}</p>
  </div>`;
		response.send(info);
	});
});

app.get(`${BASE_URL}/:id`, (request, response, next) => {
	const id = request.params.id;

	Person.findById(id)
		.then((p) => {
			if (p) {
				response.json(p);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete(`${BASE_URL}/:id`, (request, response, next) => {
	const id = request.params.id;
	Person.findByIdAndDelete(id)
		.then((result) => {
			console.log(result);
			response.status(204).end();
		})
		.catch((error) => next(error));
	response.status(204).end();
});

app.put(`${BASE_URL}/:id`, (request, response, next) => {
	const id = request.params.id;

	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(id, person, { new: true })
		.then((updatePerson) => {
			response.json(updatePerson);
		})
		.catch((error) => next(error));
});

app.post(BASE_URL, (request, response, next) => {
	const body = request.body;
	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
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

	person
		.save()
		.then((savePerson) => {
			response.json(savePerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
