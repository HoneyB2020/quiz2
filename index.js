const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Schema, model } = mongoose;

const port = process.env.PORT || 3000;

const quizSchema = new Schema({
  name: String,
  studentID: String,
});

const Student = model("Quiz", quizSchema, "w24students");

//My data
const data = [
  {
    name: "Kareem Katiya",
    studentID: "300374139"
  }
];

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post('/', async (req, res) => {
  try {
    // Get the MongoDB URI from the request body
    const { myuri } = req.body;

    // Check if the URI is provided
    if (!myuri) {
      return res.status(400).send('MongoDB URI is required');
    }

    // Connect to the database using the provided URI
    await mongoose.connect(myuri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Extract the database name from the MongoDB URI
    const dbName = new URL(myuri).pathname.replace(/^\//, '');

    const collectionName = `${dbName}_w24students`;

    // Create the Student model associated with the "w24students" collection in the extracted database
    const Student = model("Quiz", quizSchema, collectionName);

    // Insert data into the "w24students" collection
    await Student.insertMany(data);
    console.log('Data inserted into collection');

    // Send a response indicating successful data insertion
    res.send('<h1>Data Inserted into Collection</h1>');

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
