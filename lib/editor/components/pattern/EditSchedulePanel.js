// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Button, FormGroup, ControlLabel, ButtonGroup, DropdownButton, MenuItem, Tooltip} from 'react-bootstrap'

import * as activeActions from '../../actions/active'
import * as tripPatternActions from '../../actions/tripPattern'
import OptionButton from '../../../common/components/OptionButton'
import {ENTITY} from '../../constants'

import type {Feed, GtfsRoute, Pattern} from '../../../types'

type Props = {
  activeEntity: GtfsRoute,
  activePattern: Pattern,
  activePatternId: number,
  activePatternTripCount: number,
  deleteAllTripsForPattern: typeof tripPatternActions.deleteAllTripsForPattern,
  feedSource: Feed,
  saveActiveGtfsEntity: typeof activeActions.saveActiveGtfsEntity,
  setActiveEntity: typeof activeActions.setActiveEntity,
  showConfirmModal: any,
  updateActiveGtfsEntity: typeof activeActions.updateActiveGtfsEntity
}

// Outbound is zero, inbound is one.
const DIRECTIONS = [0, 1]

export default class EditSchedulePanel extends Component<Props> {
  _editTimetables = () => {
    const {setActiveEntity, feedSource, activeEntity, activePattern} = this.props
    setActiveEntity(
      feedSource.id,
      'route',
      activeEntity,
      'trippattern',
      activePattern,
      'timetable'
    )
  }

  _isDirectionOutbound = (dir: number) => dir === DIRECTIONS[0]

  _onChangeDirection = (newDirectionId: number) => {
    const {activePattern, saveActiveGtfsEntity, updateActiveGtfsEntity} = this.props
    // If direction clicked matches current direction, set directionId to null
    // (indicates that user has deselected the option).
    const directionId = activePattern.directionId === newDirectionId
      ? null
      : newDirectionId
    updateActiveGtfsEntity({
      component: 'trippattern',
      entity: activePattern,
      props: {directionId}
    })
    saveActiveGtfsEntity('trippattern')
  }

  _onChangeUseFrequency = (key: string) => {
    const {
      activePattern,
      deleteAllTripsForPattern,
      feedSource,
      saveActiveGtfsEntity,
      showConfirmModal,
      updateActiveGtfsEntity
    } = this.props
    const {name, patternId} = activePattern
    const useFrequency = key !== 'timetables' ? 1 : 0
    const unselectedOption = key === 'timetables' ? 'frequencies' : 'timetables'
    showConfirmModal({
      title: `Utiliser ${key} pour ${name}?`,
      body: `Êtes-vous sûr de vouloir utiliser ${key} pour cet itinéraire ?
      Les services créés en utilisant ${unselectedOption} seront perdus.`,
      onConfirm: () => {
        // Update and save useFrequency field
        updateActiveGtfsEntity({
          component: 'trippattern',
          entity: activePattern,
          props: {useFrequency}
        })
        saveActiveGtfsEntity('trippattern')
          // Then, delete all trips for the pattern.
          // $FlowFixMe action is wrapped in promise when connected
          .then(() => deleteAllTripsForPattern(feedSource.id, patternId))
      }
    })
  }

  render () {
    const {activePattern, activePatternId, activePatternTripCount} = this.props
    if (!activePattern) return null
    const {
      directionId,
      name,
      patternStops,
      useFrequency
    } = activePattern
    const timetableOptions = [
      <span><Icon type='table' /> Utiliser des fiches horaires</span>,
      <span><Icon type='clock-o' /> Utiliser des fréquences</span>
    ]
    const editSchedulesDisabled = activePatternId === ENTITY.NEW_ID ||
      patternStops.length === 0
    return (
      <div>
        <h4 className='line'>
          Fiches horaires {`(${activePatternTripCount} service${activePatternTripCount !== 1 ? 's' : ''})`}
        </h4>
        {!activePatternTripCount
          ? <small className='text-warning'>
            <Icon type='exclamation-triangle' />{' '}
            Pas de services en service pour cet itinéraire.
          </small>
          : null
        }
        <FormGroup style={{marginTop: '5px'}}>
          <ButtonGroup className='pull-right'>
            {DIRECTIONS.map(dir => {
              const isOutbound = this._isDirectionOutbound(dir)
              return (
                <OptionButton
                  key={dir}
                  active={directionId === dir}
                  value={dir}
                  bsSize='small'
                  style={{width: '85px'}}
                  name={dir}
                  tooltip={
                    <Tooltip
                      id={`tooltip-dir-${dir}`}>
                      {isOutbound ? 'Aller (0)' : 'Retour (1)'}
                    </Tooltip>
                  }
                  onDeselect={this._onChangeDirection}
                  onClick={this._onChangeDirection}>
                  <Icon type={isOutbound ? 'sign-out' : 'sign-in'} />
                </OptionButton>
              )
            })}
          </ButtonGroup>
          <ControlLabel><small>Direction</small></ControlLabel>
        </FormGroup>
        <Button
          block
          bsSize='small'
          data-test-id='edit-schedules-button'
          disabled={editSchedulesDisabled}
          onClick={this._editTimetables}
          // FIXME: Should this be a tooltip for a better user experience?
          title={editSchedulesDisabled
            ? `Vous devez ajouter des arrêts avant de pouvoir éditer les horaires de ${name}`
            : `Ajouter ou modifier des services pour ${name}`}
        >
          <Icon type='calendar' /> Editer les fiches horaires
        </Button>
      </div>
    )
  }
}
