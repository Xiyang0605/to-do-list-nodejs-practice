// index.js
// To use the packages installed, import 
// them using require and save them in
// a constant
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv=require("dotenv");
const path=require("path");

dotenv.config();
// Initializing a constant to use express 
// methods and create middlewares.
const app = express();

// Telling Node.js to use body-parser for
// reading data coming from our 
// incoming requests in 
//extended true for allowing rich objects and arrays to be encoded using the qs library
app.use(bodyParser.urlencoded({ extended: true }));

// Telling Nodejs that all our static 
// files(here: CSS files) are 
// stored in public folder
app.use(express.static(path.join(__dirname,'public')));

// Telling Nodejs that we will write our
// frontend in ejs files. Thus viewing
// engine has to be set to use ejs
app.set("view engine", "ejs");

// index.js
// Make sure you did not use any special
// characters(e.g. @) in your user-name
// or password
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true});
    
// Defining the schema or structure of
// a single item in mongodb
const taskSchema = {
    name: {
        type: String,
        required: true
    }
};
    
// Using the following code, node.js 
// creates a collection named 
// 'tasks' using the taskSchema
const Task = mongoose.model("Task", taskSchema);



// Serves homepage
app.get("/", async (req, res) => {
    try {
      // Get today's date in a readable format
      let today = new Date();
      let options = { 
        weekday: "long", 
        day: "numeric", 
        month: "long" 
      };
      let day = today.toLocaleDateString("en-US", options);
  
      // Fetch all tasks from the database
      const foundTasks = await Task.find({});
      
      // Render the index.ejs file with the current day and tasks
      res.render("index", { today: day, tasks: foundTasks });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });


// Add an item

app.post("/", async (req, res) => {
    const taskName = req.body.newTask;
    if (taskName) {
      const task = new Task({ name: taskName });
  
      try {
        // Save the task and then redirect to the homepage
        await task.save();
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    } else {
      res.redirect("/");
    }
  });
  

// Deleting an item

app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    try {
      await Task.findByIdAndDelete(checkedItemId);
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
