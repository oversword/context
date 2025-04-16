const printElement = (element: HTMLElement) =>
	`<${element.tagName.toLowerCase()}${[...element.attributes].map(attr => ` ${attr.name}="${attr.value}"`).join('')}${element.childNodes.length?
		`>\n${[...element.childNodes].map(child => {
			if (child instanceof HTMLElement) {
				const subResult = printElement(child)
				return subResult.split('\n').map((l: string) => `\t${l}`).join('\n')
			}
			if (child instanceof Text)
				return '\t'+child.nodeValue
			console.error(child)
			throw new Error('Unrecognised child')
		}).join('\n')}\n</${element.tagName.toLowerCase()}>`
		:' />'}`

export default printElement