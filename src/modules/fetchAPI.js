/* eslint-disable camelcase */

const main = document.querySelector('.main');
const appId = 'SpbnUJ4uyMfFME6XWyNT';
const base = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps';

const getLikes = async () => {
  const url = `${base}/${appId}/likes`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
};

const countLike = (likesList, itemId) => {
  const itemLikes = likesList.find((l) => l.item_id === itemId);
  let likeCount = 0;
  if (itemLikes !== undefined) {
    likeCount = itemLikes.likes;
  } else {
    likeCount = 0;
  }

  return likeCount;
};

const addlikes = async (itemId) => {
  const url = `${base}/${appId}/likes`;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      item_id: itemId,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const addComments = async (itemId, username, comment) => {
  const url = `${base}/${appId}/comments`;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      item_id: itemId,
      username,
      comment,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const getComment = async (itemId) => {
  const url = `${base}/${appId}/comments?item_id=${itemId}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
};

const getMealById = async (idMeal) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const meal = jsonData.meals[0];
  return meal;
};

const loadMealbyCategorie = async (mealData, categorieName, categorieDesc) => {
  const likesList = await getLikes();
  main.innerHTML = '';
  const mainTitle = document.querySelector('.mainTitle');
  const categorieDetails = document.querySelector('.categorieDetails');
  mainTitle.innerHTML = '';
  categorieDetails.innerHTML = '';
  mainTitle.innerHTML = `${categorieName}`;
  categorieDetails.innerHTML = `${categorieDesc}`;
  mealData.forEach((item) => {
    const count = countLike(likesList, item.idMeal);
    const div = document.createElement('div');
    div.classList.add('mealContent');
    div.innerHTML = `
    <img class="mealImg" src="${item.strMealThumb}" alt="${item.strMeal}">
    <p>${item.strMeal}  </p>
    <div class="actions">
      <p class ="${item.idMeal}"> <i class="fa-solid fa-thumbs-up"></i> <span class="count">${count}<span> </p>
      <button class="${item.idMeal} commentBtn" name="button">Comment </button>
      <button type="button" name="button">Reservation</button>
    </div>
    `;
    main.appendChild(div);
  });
  const likeIcone = document.querySelectorAll('.fa-thumbs-up');
  const commentBtn = document.querySelectorAll('.commentBtn');

  likeIcone.forEach((item) => {
    item.addEventListener('click', (e) => {
      const itemId = e.target.parentElement.classList[0];
      const count = e.target.parentElement.querySelector('span');
      addlikes(itemId);
      count.innerHTML = parseInt(count.innerText, 10) + 1;
      item.classList.add('active');
    });
    const count = item.parentElement.querySelector('span');
    if (parseInt(count.innerText, 10) > 0) {
      item.classList.add('active');
    }
  });

  commentBtn.forEach((item) => {
    item.addEventListener('click', async (e) => {
      const item_id = e.target.classList[0];
      const meal = await getMealById(item_id);
      const comments = await getComment(item_id);
      document.querySelector('.commentModal').classList.add('active');
      document.querySelector('.commentModal').innerHTML = `
      <div class="topDiv">
        <img src="${meal.strMealThumb}" alt="">
      </div>
        <div class="commentform">
        <i class="fa-solid fa-xmark"></i>
          <div class="meal_details">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">INGEDIENTS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mark</td>
                  </tr>
                  <tr>
                    <td>Thornton</td>
                  </tr>
                <tbody>
              </table>
            <p class="description">${meal.strInstructions}</p>
          </div>
          <div >
            <h3>COMMENTS</h3>
            <small class="commentCount"></small>
            <ul class="commentlist"></ul>
          </div>
          <form >
            <input class="username" type="text" name="" value="" placeholder="Your Name">
            <input class="comment" type="text" name="" value="" placeholder="Your Comment">
            <small class="msg"></small>
            <button class="submitBtn">submit</button>
          </form>
        </div>
      `;
      const commentlist = document.querySelector('.commentlist');
      const commentCount = document.querySelector('.commentCount');
      if (comments.error) {
        commentCount.innerHTML = '';
        commentCount.innerHTML = '0 comment found';
      } else {
        commentCount.innerHTML = '';
        commentCount.innerHTML = `${comments.length} comments in this recipe`;
        comments.forEach((comment) => {
          const li = document.createElement('li');
          const em = document.createElement('em');
          em.innerHTML = '';
          em.innerHTML = `${comment.username}`;
          li.innerHTML = `${comment.comment}`;

          commentlist.appendChild(em);
          commentlist.appendChild(li);
        });
      }

      document.querySelector('.fa-xmark').addEventListener('click', () => {
        document.querySelector('.commentModal').classList.remove('active');
      });

      document.querySelector('.submitBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.querySelector('.username');
        const comment = document.querySelector('.comment');
        const msg = document.querySelector('.msg');
        if (username.value !== '' && comment.value !== '') {
          addComments(item_id, username.value, comment.value);
          msg.innerHTML = '';
          msg.innerHTML = '👍🏾 Comment is added succesfully!';
          const li = document.createElement('li');
          const em = document.createElement('em');
          em.innerHTML = '';
          em.innerHTML = `${username.value}`;
          li.innerHTML = `${comment.value}`;
          commentlist.appendChild(em);
          commentlist.appendChild(li);
          username.value = '';
          comment.value = '';
          commentCount.innerHTML = '';
          const count = comments.length || 0;
          commentCount.innerHTML = `${count + 1} comments in this recipe`;
        } else {
          msg.innerHTML = '';
          msg.innerHTML = '😞 Something went wrong, Kindly input the fields!';
        }
      });
    });
  });
};

const fetchMealbyCategorie = async (categorieName, categorieDesc) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorieName}`;
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
    showbtn.forEach((item) => {
      item.addEventListener('click', (e) => {
        const categorieName = e.target.parentElement.querySelector('.categorieName');
        const categorieDesc = e.target.parentElement.querySelector('.description');
        fetchMealbyCategorie(categorieName.innerText, categorieDesc.innerText);
      });
    });
  });
};

const fetchCategories = async () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  const response = await fetch(url);
  const jsonData = await response.json();
  const mealCategoriesData = jsonData.categories;

  addMeal(mealCategoriesData);
  return mealCategoriesData;
};

export default fetchCategories;
