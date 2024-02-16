import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Navbar from '../Navbar'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'ISPROGRESS',
}

class ProjectsList extends Component {
  state = {
    projectData: [],
    activeStatus: status[0],
    activeOptionId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getApiProject()
  }

  getProjectsList = dataOf => ({
    id: dataOf.id,
    name: dataOf.name,
    imageUrl: dataOf.image_url,
  })

  getApiProject = async () => {
    const {activeOptionId} = this.state
    this.setState({activeStatus: status.inProgress})

    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const option = {
      method: 'GET',
    }
    const fetchData = await fetch(url, option)
    const data = await fetchData.json()
    if (fetchData.ok === true) {
      const newData = data.projects.map(eachProj =>
        this.getProjectsList(eachProj),
      )
      this.setState({projectData: newData, activeStatus: status.success})
    } else {
      this.setState({activeStatus: status.failure})
    }
  }

  changeSelect = event => {
    this.setState({activeOptionId: event.target.value}, this.getApiProject)
  }

  getLoader = () => (
    <div data-testid="loader">
      <Loader color="#00BFFF" type="TailSpin" height={50} width={50} />
    </div>
  )

  travelsListOf = travelsList => (
    <li key={travelsList.id} className="li-list1">
      <img src={travelsList.imageUrl} alt={travelsList.name} />
      <p>{travelsList.name}</p>
    </li>
  )

  getSuccess = () => {
    const {projectData} = this.state
    return (
      <ul className="ul-list">
        {projectData.map(eachTravel => this.travelsListOf(eachTravel))}
      </ul>
    )
  }

  clickBtn = () =>
    this.setState({activeStatus: status.inProgress}, this.getApiProject)

  getFailure = () => (
    <div>
      <img
        className="failureImg"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.clickBtn}>
        Retry
      </button>
    </div>
  )

  switchCaseOf = () => {
    const {activeStatus} = this.state
    switch (activeStatus) {
      case status.success:
        return this.getSuccess()
      case status.failure:
        return this.getFailure()
      case status.inProgress:
        return this.getLoader()

      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state

    return (
      <div className="mainContainer">
        <Navbar />
        <select
          className="dropDown"
          onChange={this.changeSelect}
          value={activeOptionId}
        >
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        {this.switchCaseOf()}
      </div>
    )
  }
}

export default ProjectsList
