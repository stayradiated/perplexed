import parseMediaContainer from './mediaContainer'

export function parseSection (data) {
  const section = {}

  section.allowSync  = data.allowSync
  section.art        = data.art
  section.composite  = data.composite
  section.filters    = data.filters
  section.refreshing = data.refreshing
  section.thumb      = data.thumb
  section.key        = data.key
  section.type       = data.type
  section.title      = data.title
  section.agent      = data.agent
  section.scanner    = data.scanner
  section.language   = data.language
  section.uuid       = data.uuid
  section.updatedAt  = data.updatedAt
  section.createdAt  = data.createdAt

  section.id = parseInt(section.key, 10)

  section.location = data.Location

  return section
}

export function parseSectionContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const sectionContainer = {
    ...parseMediaContainer(data),
  }

  sectionContainer.title1 = data.title1

  sectionContainer.items = data.Directory.map(parseSection)

  return sectionContainer
}
