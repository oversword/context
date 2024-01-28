/* eslint-disable no-bitwise */
/**
 * Determines the mouse buttons pressed given a mouse event
 *
 * @param { button } MouseEvent
 *
 * @returns The list of buttons pressed, 0-indexed
 */
const getButtons = ({ buttons }: MouseEvent): Array<boolean> => [
  Boolean(buttons % 2),
  Boolean((buttons >> 1) % 2),
  Boolean((buttons >> 2) % 2),
  Boolean((buttons >> 3) % 2),
  Boolean((buttons >> 4) % 2),
];
export default getButtons;
