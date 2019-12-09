/**
 * This function is passed as a prop to the component in a test environment.
 * It receives a translation query and then returns the last part after
 * the dot (keySelector in i18next)
 * @param {string} translationQuery Translation query string
 * @returns {string} Last part of a translation query
 */

export function translateMock (translationQuery) {
  const arrOfKeys = translationQuery.split('.')
  return arrOfKeys[arrOfKeys.length - 1]
}
