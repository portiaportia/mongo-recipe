async function showRecipes(){
    
    let response = await fetch(`api/recipes/`);
    let recipes = await response.json();
    let recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = "";
    console.log(recipes);
    for(i in recipes){
        console.log(recipes[i]);
        recipesDiv.appendChild(getRecipeElem(recipes[i]));
    }
}

function getRecipeElem(recipe){
    let recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    let recipeContentDiv = document.createElement("div");
    recipeContentDiv.classList.add("recipe-content");
    recipeDiv.append(recipeContentDiv);
    let recipeH3 = document.createElement("h3");
    recipeH3.innerHTML = recipe.title;
    recipeContentDiv.append(recipeH3);
    recipeP = document.createElement('p');
    recipeP.innerHTML = recipe.author + " rating " + recipe.rating + " stars";
    recipeContentDiv.appendChild(recipeP);
    return recipeDiv;
}


async function addRecipe(){
    const title = document.getElementById("txt-add-recipe-title").value;
    const author = document.getElementById("txt-add-recipe-author").value;
    const rating = document.getElementById("txt-add-recipe-rating").value;
    const ingredientsText = document.getElementById("txt-add-recipe-ingredients").value;
    const directionsText = document.getElementById("txt-add-recipe-directions").value;
    const ingredients = ingredientsText.split("\n");
    const directions = directionsText.split("\n");
    const feedbackP = document.getElementById("feedback");
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
}

window.onload = function(){
    this.document.getElementById("btn-add-recipe").onclick = addRecipe;
    this.showRecipes();
}