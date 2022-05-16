const main = document.querySelector('.main');

const fetchCategories = async () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  const response = await fetch(url);
  const jsonData = await response.json();
  const mealCategoriesData = jsonData.categories;

  addMeal(mealCategoriesData);
  return mealCategoriesData;
};

const fetchMealbyCategorie = async (categorieName, categorieDesc) => {
  const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + categorieName;
  const response = await fetch(url);
  const jsonData = await response.json();
  const mealData = jsonData.meals;
  loadMealbyCategorie(mealData, categorieName, categorieDesc);
  return mealData;
};

const addMeal = (mealData) => {
  mealData.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('singleContainer');
    div.innerHTML = `
    <img src="${item.strCategoryThumb}" alt="${item.strCategory}">
    <p class="categorieName">${item.strCategory}</p>
    <p class="description">
      ${item.strCategoryDescription}
    </p>
    <button class="showbtn" type="button" >show meals </button>
    `;
    main.appendChild(div);

    const showbtn = document.querySelectorAll('button');
    showbtn.forEach(item => {
      item.addEventListener('click', (e) => {
        const categorieName = e.target.parentElement.querySelector('.categorieName');
        const categorieDesc = e.target.parentElement.querySelector('.description');
        fetchMealbyCategorie(categorieName.innerText, categorieDesc.innerText);
      });
    });
  });
};

const loadMealbyCategorie = (mealData, categorieName, categorieDesc) => {
  main.innerHTML = '';
  const mainTitle = document.querySelector('.mainTitle');
  const categorieDetails = document.querySelector('.categorieDetails');
  mainTitle.innerHTML = '';
  categorieDetails.innerHTML = '';
  mainTitle.innerHTML = `${categorieName}`;
  categorieDetails.innerHTML = `${categorieDesc}`;

  mealData.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add(`${item.idMeal}`);
    div.classList.add('mealContent');
    div.innerHTML = `
    <img class="mealImg" src="${item.strMealThumb}" alt="${item.strMeal}">
    <p>${item.strMeal}</p>
    <button type="button" name="button">Comment </button>
    <button type="button" name="button">Like </button>
    <button type="button" name="button">Reservation </button>
    `;

    main.appendChild(div);
  });
};

export default fetchCategories;