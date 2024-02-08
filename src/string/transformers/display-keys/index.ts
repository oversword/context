import iconMap from '../../../app/constants/icon-map'
import splitCombination from '../split-combination'

/**
 * Render keys from the format: [ 'Key+Other+9', 'Some+Key++' ]
 * into the format: "Key•Other•9, Some•Key•+"
 * @param keys
 * @returns
 */
const displayKeys = (keys: Array<string>): string =>
	keys
		.map(splitCombination)
		.map(ks => ks.map(k => iconMap[k] || k).join('•'))
		.join(', ')
export default displayKeys
