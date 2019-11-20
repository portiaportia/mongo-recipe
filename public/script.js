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
}