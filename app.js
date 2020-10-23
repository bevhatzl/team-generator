const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const stylesPath = path.join(OUTPUT_DIR, "style.css");

const render = require("./lib/htmlRenderer");
const writeFileAsync = util.promisify(fs.writeFile);

//To hold an array of objects for the user answers
const employeeArray = [];

// Object constructor function for the user input questions
function Question(message, name) {
    this.type = "input";
    this.message = message;
    this.name = name;
}

// Creating instances of the Question object
let managerNameQ = new Question("What is the manager's name?", "manager");
let empNameQ = new Question("What is the employee's name?", "name");
let idQ = new Question("What is their employee id?", "id");
let emailQ = new Question("What is their email address?", "email");
let officeNumQ = new Question("What is their office number?", "officeNum");
let gitHubQ = new Question("What is their GitHub account?", "gitHub");
let schoolQ = new Question("What is their school name?", "school");

// Array of the first set of questions
const managerQuestions = [
    managerNameQ, idQ, emailQ, officeNumQ
];

// Array of questions for an Engineer
const engineerQuestions = [
    empNameQ, idQ, emailQ, gitHubQ
]

// Array of questions for an Intern
const internQuestions = [
    empNameQ, idQ, emailQ, schoolQ
]

// Prompt to get the employee type
let typeQ = {
    type: "list",
    message: "Which type of employee would you like to add?",
    name: "type",
    choices: [
        "Engineer",
        "Intern"
    ]
}

// Initiate the app and start getting user Input
console.log("Welcome to the team generator CLI");
askQuestions();

async function askQuestions() {
    try {
        const answers = await inquirer.prompt(managerQuestions);
        // First employee will be the manager. Create instance of the manager class.
        let emp = new Manager(answers.manager, answers.id, answers.email, answers.officeNum);
        // Add to employee array
        employeeArray.push(emp);
        // To confirm if user wants to add another employee.
        askToAddAnother();
    } catch (err) {
        console.log(err);
    }
}

async function getEmpDetails() {
    try {
        const answers = await inquirer.prompt(typeQ);
        // Different set of questions depending on employer role
        if (answers.type === "Engineer") {
            const answers = await inquirer.prompt(engineerQuestions);
            // Create instance of the Engineer class
            let emp = new Engineer(answers.name, answers.id, answers.email, answers.gitHub);
            console.log("Here is Emp details: " + JSON.stringify(emp));
            // Add to employee array
            employeeArray.push(emp);
        } else {
            const answers = await inquirer.prompt(internQuestions);
            // Create instance of the Intern class
            let emp = new Intern(answers.name, answers.id, answers.email, answers.school);
            // Add to employee array
            employeeArray.push(emp);
        }
        // Confirm if user wants to add another employee
        askToAddAnother();
    } catch (err) {
        console.log(err);
    }
}

// Function to handle when to stop asking for more employee details
async function askToAddAnother() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "choice",
                message: "Add another employee?"
            }
        ])
        .then(val => {
            if (val.choice) {
                // Gets more user input for another employee
                getEmpDetails();
            } else {
                // End the user input and continue to generate the file
                quit();
            }
        });
}

function quit() {
    // Get the HTML based on the array of employees
    const returnedHTML = render(employeeArray);
    // Call function to write the html file
    fileWrite(returnedHTML);
    // Read and write the CSS file
    readWriteCSS();
}

async function fileWrite(returnedHTML) {
    try {
        // Check if "output" directory exists
        ensureDirectoryExistence(outputPath);
        // Create the html file
        await writeFileAsync(outputPath, returnedHTML);
        console.log("Successfully created a HTML file located in the 'output' folder!");
        console.log("Thank you for using the team generator CLI!");
    } catch (err) {
        console.log(err);
    }
}

// Checks if the "output" directory exists and creates it if it doesn't.
function ensureDirectoryExistence(filePath) {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// To add the styles also to the "output directory"
function readWriteCSS() {
    fs.readFile('./style.css', function read(err, data) {
        if (err) {
            throw err;
        }
        const content = data;
        processFile(content);
    });

    function processFile(content) {
        writeFileAsync(stylesPath, content);
    }

}
