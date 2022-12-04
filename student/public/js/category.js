var currentQuestions = "";                 // List of questions
var sequence;                       // List of question order
var numberOfQuestions = 5;        // Number of questions to show
var currentName;
var currentCategory;
var idNum;

generateCategorySelector();


// Functions

// Generates the category selector in the landing page
function generateCategorySelector() {

    categories.forEach(category => {
        // Create category buttons for each category in the JSON
        // let categoryButton = document.createElement("button");
        // categoryButton.classList = "category-button";
        // categoryButton.innerHTML = category.name;

        categoryButton.onclick = () => {
            document.getElementById('category-wrapper').remove();
            document.getElementById('title').innerHTML = category.name;
            currentCategory = category.name;
            currentQuestions = questions[currentCategory];
            numberOfQuestions = currentQuestions.length;
        }
    });
}

