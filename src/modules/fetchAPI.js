import * as Involve from './fetchInvolvementAPI.js'
const main = document.querySelector('.main');
const appId = 'SpbnUJ4uyMfFME6XWyNT';
const apiBase = 'https://www.themealdb.com/api/json/v1/1'

const fetchCategories = async() => {
  const url = `${apiBase}/categories.php`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const mealCategoriesData = await jsonData.categories;
  return mealCategoriesData;
}

const fetchMealbyCategorie = async (categorieName, categorieDesc) => {
  const catCount = document.querySelector('.catCount')
  const url = `${apiBase}/filter.php?c=`+ categorieName;
  const response = await fetch(url);
  const jsonData = await response.json();
  const mealData = jsonData.meals;
  loadMealbyCategorie(mealData, categorieName, categorieDesc);
  catCount.innerHTML = ` We have ${mealData.length} Menu`
  return mealData;
};

const getMealById = async (idMeal) => {
  const url = `${apiBase}/lookup.php?i=`+idMeal;
  const response = await fetch(url);
  const jsonData = await response.json();
  const meal = jsonData.meals[0];
  return meal;
};

const addCategorieMeal = (mealData) => {
    mealData.forEach((item) => {
      const div = document.createElement('div');
      div.classList.add('singleContainer');
      div.innerHTML = `
        <div class="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-dark overflow-hidden">
          <div class="my-3 py-3">
            <h2 class="categorieName display-5">${item.strCategory}</h2>
            <p class="lead description">${item.strCategoryDescription}</p>
            <button class="showbtn" type="button" >show meals </button>
          </div>
          <div class="bg-light box-shadow mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;">
              <img src="${item.strCategoryThumb}" alt="${item.strCategory}">
          </div>
        </div>`;

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


const loadMealbyCategorie = async (mealData, categorieName, categorieDesc) => {
  const likesList = await Involve.getLikes();
  main.innerHTML = '';
  const mainTitle = document.querySelector('.mainTitle');
  const qMark = document.querySelector('.qMark')
  const categorieDetails = document.querySelector('.categorieDetails');
  mainTitle.innerHTML = '';
  qMark.innerHTML = '';
  qMark.innerHTML = '';
  mainTitle.innerHTML = `You want ${categorieName} ?!`;
  qMark.innerHTML = 'Very good ! Now choose one menu !';
  mealData.forEach((item) => {
    const count = Involve.countLike(likesList, item.idMeal);
    const div = document.createElement('div');
    div.classList.add('mealContent');
    div.innerHTML = `
    <img class="mealImg" src="${item.strMealThumb}" alt="${item.strMeal}">
    <p class="mealName">${item.strMeal}  </p>
    <div class="actions">
      <p class ="${item.idMeal}"> <i class="fa-solid fa-thumbs-up"><span class="count">${count}<span> </i> </p>
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
      Involve.addlikes(itemId);
      count.innerHTML = parseInt(count.innerText, 10) + 1;
      item.classList.add('active');
    });
    const count = item.parentElement.querySelector('span');
    if(parseInt(count.innerText,10) > 0 ) {
      item.classList.add('active');
    }
  });

  commentBtn.forEach((item) => {
    item.addEventListener('click', async (e) => {
      var item_id = e.target.classList[0];
      const meal = await getMealById(item_id);
      var comments = await Involve.getComment(item_id);
      document.querySelector('.commentModal').classList.add('active');
      document.querySelector('.commentModal').innerHTML = `
      <div class="topDiv">
      <i class="fa-solid fa-xmark"></i>
        <img src="${meal.strMealThumb}" alt="">
      </div>
        <div class="commentform">
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
      var commentlist = document.querySelector('.commentlist');
      var commentCount = document.querySelector('.commentCount');
      if(comments.error){
        commentCount.innerHTML = "";
        commentCount.innerHTML = "0 comment found";
      } else {
        commentCount.innerHTML = "";
        commentCount.innerHTML = comments.length + " comments in this recipe";
        comments.forEach(comment => {
            const li = document.createElement('li');
            const em = document.createElement('em');
            li.classList.add('commentMsg');
            em.classList.add('commentName');
            em.innerHTML = "";
            em.innerHTML = `${comment.username}`;
            li.innerHTML = `${comment.comment}`;

            commentlist.appendChild(em)
            commentlist.appendChild(li)
        });
      };

      document.querySelector('.fa-xmark').addEventListener('click', () => {
        document.querySelector('.commentModal').classList.remove('active');
      });

      document.querySelector('.submitBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.querySelector('.username');
        const comment = document.querySelector('.comment');
        const msg = document.querySelector('.msg');
        if(username.value !== "" && comment.value !== "") {
            Involve.addComments(item_id, username.value, comment.value)
            msg.innerHTML = "";
            msg.innerHTML = "👍🏾 Comment is added succesfully!";
            const li = document.createElement('li');
            const em = document.createElement('em')
            em.innerHTML = "";
            em.innerHTML = `${username.value}`;
            li.innerHTML = `${comment.value}`;
            li.classList.add('commentMsg')
            em.classList.add('commentName')
            commentlist.appendChild(em)
            commentlist.appendChild(li)
            username.value = "";
            comment.value = "";
            commentCount.innerHTML = "";
            const count = comments.length || 0
            commentCount.innerHTML = count + 1 + " comments in this recipe";
        } else {
          msg.innerHTML = "";
          msg.innerHTML = " 😞 Something went wront., Kindly input the fields!";
        }
      })
    });
  });
};
export {fetchCategories, addCategorieMeal};
