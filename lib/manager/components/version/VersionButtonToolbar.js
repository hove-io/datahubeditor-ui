// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Button, Glyphicon, ButtonGroup, DropdownButton, MenuItem} from 'react-bootstrap'

import ConfirmModal from '../../../common/components/ConfirmModal'
import {getComponentMessages, isModuleEnabled} from '../../../common/util/config'
import type {FeedVersionSummary, ShapefileExportType} from '../../../types'

import type {ListProps} from './FeedVersionViewer'

type ToolbarProps = ListProps & {
  size: string,
  versionSummary: FeedVersionSummary
}

export default class VersionButtonToolbar extends Component<ToolbarProps> {
  messages = getComponentMessages('VersionButtonToolbar')

  _onClickDownload = () => {
    const { downloadFeedViaToken, isPublic, versionSummary } = this.props
    downloadFeedViaToken(versionSummary.id, isPublic)
  }

  _onClickLoadIntoEditor = (evt: SyntheticMouseEvent<HTMLInputElement>) => {
    const {loadFeedVersionForEditing, versionSummary} = this.props

    const {id: feedVersionId, feedSourceId} = versionSummary
    this.refs.confirm.open({
      title: this.messages('load'),
      body: this.messages('confirmLoad'),
      onConfirm: () =>
        loadFeedVersionForEditing({feedSourceId, feedVersionId})
    })
  }

  _onClickDeleteVersion = (evt: SyntheticMouseEvent<HTMLInputElement>) => {
    const {deleteFeedVersion, versionSummary} = this.props
    this.refs.confirm.open({
      title: `${this.messages('delete')} ${this.messages('version')}`,
      body: this.messages('confirmDelete'),
      onConfirm: () => deleteFeedVersion(versionSummary)
    })
  }

  _onDownloadShapes = (type: ShapefileExportType) => {
    const { exportVersionShapes, versionSummary } = this.props
    exportVersionShapes(versionSummary.id, type)
  }

  render () {
    const {
      deleteDisabled,
      deleteFeedVersion,
      editDisabled,
      hasVersions,
      isPublic,
      size
    } = this.props
    return (
      <div style={{display: 'inline'}}>
        <ConfirmModal ref='confirm' />
        <ButtonGroup className='pull-right'>

          {/* "Download Feed" Button */}
          <Button
            bsSize={size}
            data-test-id='download-feed-version-button'
            disabled={!hasVersions}
            onClick={this._onClickDownload}>
            <Glyphicon glyph='download' />
            <span className='hidden-xs'> {this.messages('download')}</span>
            <span className='hidden-xs hidden-sm'> {this.messages('version')}</span>
          </Button>
          </ButtonGroup>
      </div>
    )
  }
}
