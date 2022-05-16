const main = document.querySelector('.main');
const appId = 'SpbnUJ4uyMfFME6XWyNT';
const base = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps';


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

const loadMealbyCategorie = async (mealData, categorieName, categorieDesc) => {
  const likesList = await getLikes()
  main.innerHTML = '';
  const mainTitle = document.querySelector('.mainTitle');
  const categorieDetails = document.querySelector('.categorieDetails');
  mainTitle.innerHTML = '';
  categorieDetails.innerHTML = '';
  mainTitle.innerHTML = `${categorieName}`;
  categorieDetails.innerHTML = `${categorieDesc}`;
  mealData.forEach((item) => {
    const count = countLike(likesList, item.idMeal)
    const div = document.createElement('div');
    div.classList.add('mealContent');
    div.innerHTML = `
    <img class="mealImg" src="${item.strMealThumb}" alt="${item.strMeal}">
    <p>${item.strMeal}  </p>
    <div class="actions">
      <p class ="${item.idMeal}"> <i class="fa-solid fa-thumbs-up"></i> <span class="count">${count}<span> </p>
      <button type="button" name="button">Comment 2M </button>
      <button type="button" name="button">Reservation 3k</button>
    </div>
    `;
    main.appendChild(div);
  });
  const likeIcone = document.querySelectorAll('.fa-thumbs-up')
  likeIcone.forEach((item) => {
    item.addEventListener('click', (e) => {
      const itemId = e.target.parentElement.classList[0];
      const count = e.target.parentElement.querySelector('span');
      addlikes(itemId)
      count.innerHTML = parseInt(count.innerText,10) + 1;
      item.classList.add('active');
    });
    const count = item.parentElement.querySelector('span');
    if(parseInt(count.innerText,10) > 0 ) {
      item.classList.add('active')
    }
  })
};


const getLikes = async (itemId) => {
  const appUrl = `${base}/${appId}/likes`
  const response = await fetch(appUrl);
  const jsonData = await response.json()
  return jsonData
}

const countLike = (likesList, itemId) => {
  const itemLikes = likesList.find(l => l.item_id === itemId)
  let likeCount = 0
  if(itemLikes != undefined) {
    likeCount = itemLikes.likes
  } else {
    likeCount = 0
  }

  return likeCount
}

const addlikes = async (item_id) => {
  const appUrl = `${base}/${appId}/likes`
  await fetch(appUrl, {
    method: 'POST',
    body: JSON.stringify({
      item_id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
}




export default fetchCategories;
