// import mongoose from "mongoose";

// if (process.argv.length < 3) {
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }

// const password = process.argv[2];

// const url = `mongodb+srv://mern_user:${password}@cluster0.yzdqw.mongodb.net/phonebook?retryWrites=true&w=majority`;

// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model("Person", personSchema);

// if (process.argv.length == 3) {
//   const findPersons = async () => {
//     const result = await Person.find({});
//     console.log("phonebook:");
//     result.forEach((r) => console.log(`${r.name} ${r.number}`));
//     mongoose.connection.close();
//   };
//   findPersons();
// }

// if (process.argv.length == 5) {
//   const createPerson = async () => {
//     const name = process.argv[3];
//     const number = process.argv[4];
//     const person = new Person({
//       name,
//       number,
//     });
//     const result = await person.save();
//     console.log(`added ${result.name} number ${result.number} to phonebook`);
//     mongoose.connection.close();
//   };
//   createPerson();
// }
