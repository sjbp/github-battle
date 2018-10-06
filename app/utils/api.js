const axios = require('axios')

const id = 'a42a76ffba9b8d41a4ab'
const sec = 'f79fa34ce78f2318ffb040f31ce1f5acad974425'
const params = `?client_id=${id}&client_secret=${sec}`

function getProfile(username) {
  return axios
    .get(`https://api.github.com/users/${username}${params}`)
    .then(({ data }) => data)
}

function getRepos(username) {
  return axios.get(
    `https://api.github.com/users/${username}/repos${params}&per_page=100`
  )
}

function getStarCount(repos) {
  return repos.data.reduce(
    (count, { stargazers_count }) => count + stargazers_count,
    0
  )
}

function calculateScore({ followers }, repos) {
  return followers * 3 + getStarCount(repos)
}

function handleError(error) {
  console.warn(error)
  return null
}

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile, repos)
    })
  )
}

const sortPlayers = players => {
  return players.sort((a, b) => b.score - a.score)
}

module.exports = {
  battle(players) {
    return Promise.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
  fetchPopularRepos(language) {
    const encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories${params}`
    )
    return axios.get(encodedURI).then(({ data }) => {
      return data.items
    })
  }
}
