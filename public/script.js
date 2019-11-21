async function showRecipes(){
    let response = await fetch(`api/recipes/`);
    let recipes = await response.json();
    let recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = "";
    //console.log(recipes);
    for(i in recipes){
        recipesDiv.appendChild(getRecipeElem(recipes[i]));
    }
}

function getRecipeElem(recipe){
    let recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    let recipeContentDiv = document.createElement("div");
    recipeContentDiv.classList.add("recipe-content");
    recipeDiv.append(recipeContentDiv);

    //create a link to expand and contract the recipe details
    let recipeHeading = document.createElement("div");
    let recipeA = document.createElement("a");
    let recipeH3 = document.createElement("h3");
    recipeA.append(recipeH3);
    recipeA.onclick = expandRecipe;
    recipeA.setAttribute("href", "#");
    recipeA.setAttribute("data-id", recipe._id);
    recipeH3.innerHTML = recipe.title;
    recipeHeading.append(recipeA);
    recipeHeading.classList.add('recipe-heading');
    recipeHeading.append(getRecipeButtons(recipe));
    recipeContentDiv.append(recipeHeading);
    recipeContentDiv.appendChild(getRecipeExpand(recipe));
    return recipeDiv;
}

function getRecipeButtons(recipe){
    let buttonsDiv = document.createElement("div");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    deleteButton.innerHTML = "Delete";
    editButton.setAttribute("data-id", recipe._id);
    deleteButton.setAttribute("data-id", recipe._id);
    editButton.onclick = showEditForm;
    deleteButton.onclick = deleteRecipe;
    buttonsDiv.append(editButton);
    buttonsDiv.append(deleteButton);
    return buttonsDiv;
}

async function showEditForm(){
    let recipeId = this.getAttribute("data-id");
    document.getElementById("edit-recipe-id").textContent = recipeId;

    let response = await fetch(`api/recipes/${recipeId}`);

    if(response.status != 200){
        //showError("Error Displaying recipe");
        return;
    }

    let recipe = await response.json();
    document.getElementById('txt-edit-recipe-title').value = recipe.title;
    document.getElementById("txt-edit-recipe-author").value=recipe.author;
    document.getElementById("txt-edit-recipe-rating").value=recipe.rating;
    if(recipe.ingredients != null){
        document.getElementById("txt-edit-recipe-ingredients").value = recipe.ingredients.join('\n');
    }
    if(recipe.directions != null){
        document.getElementById("txt-edit-recipe-directions").value = recipe.directions.join('\n');
    }
}

async function deleteRecipe(){
    //clearError();
    let recipeId = this.getAttribute('data-id');

    let response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });
    if(response.status != 200){
        //showError("Error deleting recipe");
        console.log("Error deleting recipe");
        return;
    }
    
    let result = await response.json();
    console.log("successful delete");
    showRecipes();
}

function getRecipeExpand(recipe){
    //add the recipe details
    recipeExpand = document.createElement("div");
    recipeExpand.setAttribute("id", recipe._id);
    recipeExpand.classList.add("hidden");
    authorP = document.createElement('p');
    authorP.innerHTML = `<b>Author: </b> ${recipe.author}`;
    ratingsP = document.createElement("p");
    ratingsP.innerHTML = `<b>Rating: </b> ${recipe.rating} stars`;
    
    recipeExpand.append(authorP);
    recipeExpand.append(ratingsP);
    recipeExpand.append(getIngredientsElement(recipe));
    recipeExpand.append(getDirectionsElement(recipe));
    return recipeExpand;
}

function getIngredientsElement(recipe){
    return getArrayInfo("Ingredients", recipe.ingredients);
}

function getDirectionsElement(recipe){
    return getArrayInfo("Directions", recipe.directions);
}

function getArrayInfo(title, list){
    let divContent = document.createElement("div");
    let divTitle = document.createElement("h4");
    divTitle.innerHTML = title + ": ";
    divContent.append(divTitle);

    let ulElem = document.createElement("ul");
    for(i in list){
        liElem = document.createElement("li");
        liElem.innerHTML = list[i];
        ulElem.append(liElem);
    }
    divContent.append(ulElem);
    return divContent;
}

function expandRecipe()
{
    let expandId = this.getAttribute("data-id");
    let expandElem = document.getElementById(expandId);
    expandElem.classList.toggle("hidden");
    return false;
}


async function addRecipe(){
    const title = document.getElementById("txt-add-recipe-title").value;
    const author = document.getElementById("txt-add-recipe-author").value;
    const rating = document.getElementById("txt-add-recipe-rating").value;
    const ingredientsText = document.getElementById("txt-add-recipe-ingredients").value;
    const directionsText = document.getElementById("txt-add-recipe-directions").value;
    const ingredients = ingredientsText.split("\n");
    const directions = directionsText.split("\n");
    const feedbackP = document.getElementById("add-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let recipe = {"title": title, "author": author, "rating": rating, "ingredients": ingredients, "directions":directions};
    console.log(recipe);

    let response = await fetch('/api/recipes/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(recipe),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Adding Recipe";
        feedbackP.classList.add("error");
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Added Recipe";
    feedbackP.classList.add("success");
    showRecipes();
}

async function editRecipe(){
    const id = document.getElementById("edit-recipe-id").textContent;
    const title = document.getElementById("txt-edit-recipe-title").value;
    const author = document.getElementById("txt-edit-recipe-author").value;
    const rating = document.getElementById("txt-edit-recipe-rating").value;
    const ingredientsText = document.getElementById("txt-edit-recipe-ingredients").value;
    const directionsText = document.getElementById("txt-edit-recipe-directions").value;
    const ingredients = ingredientsText.split("\n");
    const directions = directionsText.split("\n");
    const feedbackP = document.getElementById("edit-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let recipe = {"title": title, "author": author, "rating": rating, "ingredients": ingredients, "directions":directions};
    console.log(recipe);

    let response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(recipe),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Editing Recipe";
        feedbackP.classList.add("error");
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Editted Recipe";
    feedbackP.classList.add("success");
    showRecipes();
}

window.onload = function(){
    this.document.getElementById("btn-add-recipe").onclick = addRecipe;
    this.showRecipes();

    this.document.getElementById("btn-edit-recipe").onclick = editRecipe;
}