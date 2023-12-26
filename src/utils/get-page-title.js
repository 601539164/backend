import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Renogy DTC Console'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
