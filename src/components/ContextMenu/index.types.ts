import {
	ContextApi,
	ContextInterceptGroup,
	ContextActMenuItem as ContextMenuItemType,
} from '@/types/index.types'

export interface ContextMenuProps {
	id: string;
	menu?: Array<ContextMenuItemType>;
	level?: number;
	intercept?: ContextInterceptGroup;
	apiRef?: React.Ref<ContextApi>
}
