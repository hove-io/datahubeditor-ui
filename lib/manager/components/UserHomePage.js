// @flow

import { Auth0ContextInterface } from '@auth0/auth0-react'
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import { Alert, Button, ButtonToolbar, Col, Grid, Jumbotron, Row } from 'react-bootstrap'
import objectPath from 'object-path'

import * as feedsActions from '../actions/feeds'
import * as userActions from '../actions/user'
import * as visibilityFilterActions from '../actions/visibilityFilter'
import ManagerPage from '../../common/components/ManagerPage'
import { AUTH0_DISABLED, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../../common/constants'
import {getConfigProperty, getComponentMessages} from '../../common/util/config'
import {defaultSorter} from '../../common/util/util'
import type {Props as ContainerProps} from '../containers/ActiveUserHomePage'
import type {Project} from '../../types'
import type {ManagerUserState, ProjectFilter} from '../../types/reducers'

import RecentActivityBlock from './RecentActivityBlock'
import UserAccountInfoPanel from './UserAccountInfoPanel'
import FeedSourcePanel from './FeedSourcePanel'
import HomeProjectDropdown from './HomeProjectDropdown'

type Props = ContainerProps & {
  auth0: Auth0ContextInterface,
  fetchProjectFeeds: typeof feedsActions.fetchProjectFeeds,
  logout: typeof userActions.logout,
  onUserHomeMount: typeof userActions.onUserHomeMount,
  project: Project,
  projectId: string,
  projects: Array<Project>,
  setVisibilityFilter: typeof visibilityFilterActions.setVisibilityFilter,
  setVisibilitySearchText: typeof visibilityFilterActions.setVisibilitySearchText,
  user: ManagerUserState,
  visibilityFilter: ProjectFilter
}

type State = {
  showLoading: boolean
}

const sortByDate = (a, b) => {
  if (a.date < b.date) return 1
  if (a.date > b.date) return -1
  return 0
}

export default class UserHomePage extends Component<Props, State> {
  state = {
    showLoading: false
  }

  messages = getComponentMessages('UserHomePage')

  componentWillMount () {
    const {onUserHomeMount, projectId, user} = this.props
    onUserHomeMount(user, projectId)
  }

  componentWillReceiveProps (nextProps: Props) {
    const nextId = objectPath.get(nextProps, 'project.id')
    const id = objectPath.get(this.props, 'project.id')
    if (nextId && nextId !== id && !nextProps.project.feedSources) {
      this.props.fetchProjectFeeds(nextProps.project.id)
    }
  }

  componentWillUnmount () {
    this.setState({showLoading: true})
  }

  handleLogout = () => {
    this.props.logout(this.props.auth0)
  }

  render () {
    const {
      projects,
      project,
      setVisibilityFilter,
      setVisibilitySearchText,
      user,
      visibilityFilter
    } = this.props
    const visibleProjects = projects.sort(defaultSorter)
    const activeProject = project
    const appTitle = getConfigProperty('application.title') || 'datahub editor'
    return (
      <ManagerPage
        ref='page'
        title={project ? `Accueil (${project.name})` : 'Accueil'}
      >
        <Grid fluid>
          {this.state.showLoading ? <Icon className='fa-5x fa-spin' type='refresh' /> : null}
          <Row>
            <Col md={8} xs={12}>
              {/* Top Welcome Box */}
              <Jumbotron style={{ padding: 30 }}>
                <h2>{this.messages('welcomeTo')} {appTitle || DEFAULT_TITLE}!</h2>
                <p>{getConfigProperty('application.description') || DEFAULT_DESCRIPTION}</p>
              </Jumbotron>
            </Col>
            <Col md={4} xs={12}>
              <UserAccountInfoPanel
                logout={this.handleLogout}
                user={user}
              />
            </Col>
          </Row>
          <HomeProjectDropdown
                activeProject={activeProject}
                user={user}
                visibleProjects={visibleProjects}
              />
        </Grid>
      </ManagerPage>
    )
  }
}
