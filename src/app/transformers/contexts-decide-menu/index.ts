import { ContextAction, ContextMenuItemList, StoreMetaList } from '../../types/index.types';
import PartialOmit from '../../types/partial-omit';
import { pathExtract, pathMatch } from '../../utils/selector';

const contextsDecideMenu = (
  contexts: StoreMetaList,
  action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemList =>
  contexts.reduce((current: ContextMenuItemList, { config }): ContextMenuItemList => {
    const { menu } = config;
    if (!menu) return current;
    const matchingMenus = Object.keys(menu).map(pathExtract).filter(pathMatch(action.path));
    return matchingMenus.reduce(
      (current: ContextMenuItemList, type: ReturnType<typeof pathExtract>): ContextMenuItemList => {
        const menuGen = menu[type.path];
        if (typeof menuGen === 'function') return menuGen(action, current);
        if (Array.isArray(menuGen)) return [...menuGen, ...current];
        console.error(`Unknown menu type: ${typeof menuGen}`);
        return current;
      },
      current,
    );
  }, []);

export default contextsDecideMenu;
