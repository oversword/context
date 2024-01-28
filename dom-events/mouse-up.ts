import getButtons from '../utils/event-buttons';
import { HandleConfig } from '../types/dom-events.types';

const mouseUp: HandleConfig<MouseEvent> = {
  before: (event: MouseEvent) =>
    getButtons(event).reduce(
      (current, active, index) => ({ ...current, [`Button${index + 1}`]: active }),
      {},
    ),
};
export default mouseUp;
