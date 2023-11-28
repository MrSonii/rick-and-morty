//url imports
import { rickMortyBaseURL } from "../lib/config";//baseURL for api

export const getRickMortyCharacters = (string = "", page, filterby, filterVal) => {
  const data = {
    method: "GET",
  };

  let status = null;

  return new Promise((resolve, reject) => {//handelling PROMISE returned form api call.
    
    //getting details using fetch method provided by JS, could have used other liberay like axios.
    //URL is kept in lib/config.js, so that can be used by import the same in other files when needed.
    fetch(`${rickMortyBaseURL}/character?${string ? `name=${string}&` : ""}${page ? `page=${page}&` : ""}${filterby ? `${filterby}=${filterVal}&` : ""}`, data)
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((responseObj) => {
        return resolve({ status, data: responseObj });
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export const getRickMortyCharacterEpisodes = (list) => {
  const data = {
    method: "GET",
  };

  let status = null;

  return new Promise((resolve, reject) => {//handelling PROMISE returned form api call.

    //getting details using fetch method provided by JS, could have used other liberay like axios.
    //URL is kept in lib/config.js, so that can be used by import the same in other files when needed.
    fetch(`${rickMortyBaseURL}/episode/${list}`, data)
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((responseObj) => {
        return resolve({ status, data: responseObj });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export const getRickMortyCharacterLocation = (int) => {
  const data = {
    method: "GET",
  };

  let status = null;

  return new Promise((resolve, reject) => {//handelling PROMISE returned form api call.

    //getting details using fetch method provided by JS, could have used other liberay like axios.
    //URL is kept in lib/config.js, so that can be used by import the same in other files when needed.
    fetch(`${rickMortyBaseURL}/location/${int}`, data)
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((responseObj) => {
        return resolve({ status, data: responseObj });
      })
      .catch((err) => {
        return reject(err);
      });
  });
}