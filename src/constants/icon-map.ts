/**
 * Special display glyphs (see generic/string/transformers/display-keys),
 * indexed by their symbol name (result of generic/event/transformers/event-symbol, see ./symbol-map)
 */
const iconMap = {
	Shift: '⇧',
	Enter: '↩',
	Backspace: '⌫',
	Delete: 'DEL', // '␡',
	Escape: 'ESC', // '␛',
	Tab: '⇥',
	CapsLock: '⇪',
	ArrowLeft: '←',
	ArrowRight: '→',
	ArrowUp: '↑',
	ArrowDown: '↓',

	// TODO: These three are mac-specific icons, should be smarter
	Meta: '⌘',
	Ctrl: '^',
	Alt: '⌥',
	IntlBackslash: '§',
	// Escape: '⎋',
}
export default iconMap
