import {
	ContextActionName,
	ContextData,
	ContextKeyList,
	ContextDataGenerator,
	ContextId,
} from '@/types/index.types'

export interface ContextMenuItemProps {
	keys?: ContextKeyList;
	action?: symbol | ContextActionName;
	data?: ContextData | ContextDataGenerator | null;
	label?: string | null;
	disabled?: boolean;
	title?: string | null;
	id: ContextId
}
