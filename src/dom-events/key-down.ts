import getChar from '../utils/event-char';
import getSymbol from '../utils/event-symbol';
import { HandleConfig } from '../types/dom-events.types';

const keyDown: HandleConfig<KeyboardEvent> = {
  before: (event: KeyboardEvent) => ({
    [getSymbol(event)]: true,
  }),
  keyInfo: (event: KeyboardEvent) => ({
    pos: event.code,
    char: getChar(event),
    symbol: getSymbol(event),
  }),
};

export default keyDown;
