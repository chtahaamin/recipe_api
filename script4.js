document.addEventListener('DOMContentLoaded', () => {
    const mealCard = document.getElementById("cards");
    const mealDetailContent = document.querySelector('.meal-detail-content');
    const recipeCloseBtn = document.getElementById('recipe-close-btn');
  
   
    fetchAllDishes();
  
    
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', getMealList);
    mealCard.addEventListener("click", getMealRecipe);
  
    function fetchAllDishes() {
      fetch(`https://api.spoonacular.com/recipes/random?apiKey=068734b0bb7b47dbafad904706b59393&number=12`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem('allDishes', JSON.stringify(data.recipes)); 
          displayMeals(data.recipes);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  
    function getMealList() {
      let searchInputValue = document.getElementById("search-input").value.trim().toLowerCase();
  
      if (searchInputValue === "") {
        fetchAllDishes();
        return;
      }
  
      if (localStorage.getItem(searchInputValue)) {
        const data = JSON.parse(localStorage.getItem(searchInputValue));
        displayMeals(data);
      } else {
        fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=068734b0bb7b47dbafad904706b59393&ingredients=${searchInputValue}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.length > 0) {
              localStorage.setItem(searchInputValue, JSON.stringify(data)); 
              displayMeals(data);
            } else {
              mealCard.innerHTML = `<p class="notFound">Sorry, we do not have a recipe for "${searchInputValue}"</p>`;
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }
    }
  
    function displayMeals(data) {
      let html = '';
      data.forEach(meal => {
        html += `
          <div class="card_main" data-id="${meal.id}">
            <img src="${meal.image}" class="cardimage" alt="${meal.title}">
            <p class="meal-name">${meal.title}</p>
            <a href="#" class="recipe-btn">Get Recipe</a>
          </div>
        `;
      });
      mealCard.innerHTML = html;
      mealCard.classList.remove("notFound");
    }
  
    function getMealRecipe(e) {
      e.preventDefault();
      if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement;
        fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=068734b0bb7b47dbafad904706b59393`)
          .then((response) => response.json())
          .then((meal) => {
            console.log(meal);
            mealDetailContent.innerHTML = `
              <h2 class="recipe-title">${meal.title}</h2>
              <p class="recipe-category">${meal.dishTypes.join(', ')}</p>
              <div class="recipe-instruction">
                <h3>Instructions:</h3>
                <p>${meal.instructions}</p>
              </div>
              <div class="recipe-meal-img">
                <img src="${meal.image}" alt="${meal.title}">
              </div>
              <div class="recipe-link">
                <a href="${meal.sourceUrl}" target="_blank">Read More</a>
              </div>
            `;
            document.querySelector('.meal-detail').style.display = 'block';
          })
          .catch((error) => {
            console.error('Error fetching recipe details:', error);
          });
      }
    }
  
    recipeCloseBtn.addEventListener('click', () => {
      document.querySelector('.meal-detail').style.display = 'none';
    });
  });
  