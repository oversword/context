import symbolMap from '../constants/symbol-map';

/**
 * Get symbol from KeyboardEvent information
 *
 * @param code  Event.code
 * @param _key  Event.key
 *
 * @returns     The root symbol that was pressed
 */
const getSymbol = ({ code }: KeyboardEvent): string => {
  if (code.length === 4 && code.slice(0, 3) === 'Key') return code.slice(3);
  if (code.length === 6 && code.slice(0, 5) === 'Digit') return code.slice(5);
  if (code.length === 7 && code.slice(0, 6) === 'Numpad') return code.slice(6);
  return symbolMap[code] || code;
};
export default getSymbol;
