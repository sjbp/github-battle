import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import Loading from './Loading'

// Using react-router, this should probably be a NavLink
function SelectLanguage({ selectedLanguage, onSelect }) {
  const languages = ['All', 'Javascript', 'CSS', 'Python', 'Go', 'Ruby', 'Java']
  return (
    <ul className="languages">
      {languages.map(lang => {
        return (
          <li
            style={lang === selectedLanguage ? { color: '#d0021b' } : null}
            onClick={() => onSelect(lang)}
            key={lang}
          >
            {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

// A react Route that matches the selected langauge
function RepoGrid({ repos }) {
  return (
    <ul className="popular-list">
      {repos.map(({ name, owner, html_url, stargazers_count }, index) => {
        const { avatar_url, login } = owner
        return (
          <li className="popular-item" key={name}>
            <div className="popular-rank">#{index + 1}</div>
            <ul className="space-list-item">
              <li>
                <img
                  className="avatar"
                  src={avatar_url}
                  alt={'Avatar for ' + login}
                />
              </li>
              <li>
                <a href={html_url}>{name}</a>
              </li>
              <li>@{login}</li>
              <li>{stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All'
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage = async lang => {
    this.setState(() => ({
      selectedLanguage: lang,
      repos: null
    }))

    const repos = await fetchPopularRepos(lang)
    this.setState(() => ({ repos }))
  }

  render() {
    const { selectedLanguage, repos } = this.state
    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!repos ? <Loading /> : <RepoGrid repos={repos} />}
      </div>
    )
  }
}

export default Popular
