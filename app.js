const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

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

console.log("Welcome to the team generator CLI");
askQuestions();

async function askQuestions() {
    try {
        const answers = await inquirer.prompt(managerQuestions);
        let emp = new Manager(answers.manager, answers.id, answers.email, answers.officeNum);
        employeeArray.push(emp);
        // console.log(employeeArray);
        // const returnedObj = render(employeeArray);
        // console.log(returnedObj);
        askToAddAnother();


    } catch (err) {
        console.log(err);
    }

}

async function getEmpDetails() {
    try {
        const answers = await inquirer.prompt(typeQ);

        if (answers.type === "Engineer") {
            const answers = await inquirer.prompt(engineerQuestions);
            let emp = new Engineer(answers.name, answers.id, answers.email, answers.gitHub);
            employeeArray.push(emp);
            // let emp = new Manager(answers.manager, answers.id, answers.email, answers.officeNum);
            // employeeArray.push(emp);
        } else {
            const answers = await inquirer.prompt(internQuestions);
            let emp = new Intern(answers.name, answers.id, answers.email, answers.school);
            employeeArray.push(emp);
        }

        askToAddAnother();



    } catch (err) {
        console.log(err);
    }
}

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
                getEmpDetails();
            } else {
                quit();
            }
        });
}

function quit() {
    console.log("\nGoodbye!");
    console.log(employeeArray);
    // process.exit(0);

}



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!




// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
