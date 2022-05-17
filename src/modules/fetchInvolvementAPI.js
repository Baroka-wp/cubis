const involveBase = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps';
const appId = 'SpbnUJ4uyMfFME6XWyNT';

const getLikes = async () => {
  const url = `${involveBase}/${appId}/likes`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
};

const countLike = (likesList, itemId) => {
  const itemLikes = likesList.find(l => l.item_id === itemId);
  let likeCount = 0;
  if (itemLikes !== undefined) {
    likeCount = itemLikes.likes
  } else {
    likeCount = 0;
  }

  return likeCount;
};

const addlikes = async (item_id) => {
  const url = `${involveBase}/${appId}/likes`;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      item_id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const addComments = async (item_id, username, comment) => {
  const url = `${involveBase}/${appId}/comments`;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      item_id,
      username,
      comment,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const getComment = async (item_id) => {
  const url = `${involveBase}/${appId}/comments?item_id=`+item_id;
  const response = await fetch(url);
  const jsonData = await response.json()
  return jsonData
}


export { getLikes, countLike, addlikes, addComments, getComment };
