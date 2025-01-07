// @flow

import React, {Component} from 'react'
import { Panel, Badge, Row, Col } from 'react-bootstrap'

import * as userActions from '../actions/user'
import {getComponentMessages} from '../../common/util/config'
import UserButtons from '../../common/components/UserButtons'
import type {ManagerUserState} from '../../types/reducers'

type Props = {
  logout: typeof userActions.logout,
  user: ManagerUserState
}

export default class UserAccountInfoPanel extends Component<Props> {
  messages = getComponentMessages('UserAccountInfoPanel')

  render () {
    const {
      user,
      logout
    } = this.props
    const {profile, permissions} = user
    if (!profile || !permissions) {
      console.warn('Cannot find user profile/permissions in app state', user)
      return null
    }
    return (
      <Panel>
        <Panel.Body>
          <Row>
            <Col xs={4}>
              <img
                alt={this.messages('profile')}
                style={{ width: '100%', borderRadius: '50%' }}
                src={profile.picture} />
            </Col>
            <Col md={8}>
              <h4 style={{marginTop: 0, marginBottom: 15}}>
                {this.messages('hello')} {profile.nickname}.
              </h4>
              <div className='text-muted'>{profile.email}</div>
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
    )
  }
}
