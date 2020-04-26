import defaultSettings from '@/settings'

const title = defaultSettings.title || '刺绣商城'

export default function getPageTitle(pageTitle) {
  // if (pageTitle) {
  //   return `${pageTitle} - ${title}`
  // }
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}
