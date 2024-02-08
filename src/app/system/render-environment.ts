import addMenu from '../side-effects/add-menu';
import cancel from '../side-effects/cancel';
import { ContextSystemApi, ContextMenuOptions, ContextMenuResult } from '../../types/system.types';
import { Environment, EnvironmentApi, EnvironmentMenus } from '../../types/environment.types';

/**
 * Create a scoped environment and returns an api for updating it
 *
 * @returns An api for accessing the environment that has been created
 */
const provideEnvironment = (rootElement: HTMLElement): EnvironmentApi => {
  let environment: Environment | null = null;

  const api: EnvironmentApi = {
    create(container: HTMLElement): void {
      environment = {
        container,
        menus: [],
      };
    },
    delete: (): void => {
      environment = null;
    },
    exists: (): boolean => {
      return environment !== null;
    },
    cancel: (event: Event): void => cancel(api, event),
    render: (
      contextSystemApi: ContextSystemApi,
      options: ContextMenuOptions,
    ): Promise<ContextMenuResult | null> => addMenu(contextSystemApi, api, options),
    get menus(): EnvironmentMenus {
      if (environment === null) return [];
      return [...environment.menus.map(menu => ({ ...menu }))];
    },
    set menus(menus: EnvironmentMenus) {
      if (environment === null)
        throw new Error(`Menus could not be set because the environment does not exist.`);
      if (!Array.isArray(menus))
        throw new Error(`Menus must be an array of EnvironmentMenus, ${typeof menus} given.`);
      menus.forEach((menu, index) => {
        if (typeof menu !== 'object')
          throw new Error(
            `Menus must be an array of EnvironmentMenus, ${typeof menu} given at index ${index}.`,
          );
        if (!('level' in menu))
          throw new Error(
            `Menus must be an array of EnvironmentMenus, object without level given at index ${index}.`,
          );
        if (typeof menu.level !== 'number')
          throw new Error(
            `Menus must be an array of EnvironmentMenus, with a numeric level. ${typeof menu.level} given at index ${index}.`,
          );
        if (!('container' in menu) || !menu.container)
          throw new Error(
            `Menus must be an array of EnvironmentMenus, object without container given at index ${index}.`,
          );
        // TODO: test for HTML element in container?
      });
      environment.menus = menus;
    },
    get container(): HTMLElement | null {
      return environment?.container || null;
    },
    get root(): HTMLElement {
      return rootElement;
    },
  };
  return api;
};
export default provideEnvironment;
