import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchCategories, addCategorieMeal } from './modules/fetchAPI.js';

(async () => {
  const catCount = document.querySelector('.catCount');
  const categorieList = await fetchCategories();
  catCount.innerHTML = `we have ${categorieList.length} Categories`;
  addCategorieMeal(categorieList);
})();
