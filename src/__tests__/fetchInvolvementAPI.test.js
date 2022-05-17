/**
 *@jest-environment jsdom
 */

import * as Involve from '../modules/fetchInvolvementAPI.js';
import { likeslist, mealList, commentList } from '../__mocks__/fetchApi.js';

test('count likes for certain item', () => {
  const likes = likeslist();
  const itemId = '52874';
  const count = Involve.countLike(likes, itemId);
  expect(count).toBe(4);
});

test('count items', () => {
  const meals = mealList();
  const count = meals.length;
  expect(count).toBe(4);
});

test('count comments', () => {
  const comments = commentList();
  const count = comments.length;
  expect(count).toBe(3);
});
