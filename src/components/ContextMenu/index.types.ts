import {
	ContextInterceptGroup,
	ContextMetaMenuItem as ContextMenuItemType,
} from '@/types/index.types'

export interface ContextMenuProps {
	menu?: Array<ContextMenuItemType>;
	level?: number;
	intercept?: ContextInterceptGroup;
}
