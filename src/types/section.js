import { schema } from 'normalizr'

import { parseMediaContainer } from './mediaContainer'

export const sectionSchema = new schema.Entity('sections')
export const sectionContainerSchema = new schema.Object({
  sections: new schema.Array(sectionSchema)
})

export function parseSection (data) {
  const {
    allowSync = null,
    art = null,
    composite = null,
    filters = null,
    refreshing = null,
    thumb = null,
    key = null,
    type = null,
    title = null,
    agent = null,
    scanner = null,
    language = null,
    uuid = null,
    updatedAt = null,
    createdAt = null,
    Location = null
  } = data

  return {
    _type: 'section',
    id: parseInt(key, 10),
    allowSync,
    art,
    composite,
    filters,
    refreshing,
    thumb,
    key,
    type,
    title,
    agent,
    scanner,
    language,
    uuid,
    updatedAt,
    createdAt,
    location: Location
  }
}

export function parseSectionContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    title1 = null,
    Directory = []
  } = data

  return {
    ...parseMediaContainer(data),
    _type: 'sectionContainer',
    title: title1,
    sections: Directory.map(parseSection)
  }
}
