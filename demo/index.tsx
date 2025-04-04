import React, { useRef } from 'react'
import { createRoot } from "react-dom/client"
import { Context, ContextConfig, ContextInterceptGroup, DataContext, SystemContext, initialiseContextSystem } from "../src"

import { jsx, css, Global, ClassNames } from '@emotion/react'

const style = document.createElement('style')
style.innerHTML = `
body,html {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
#root {
	width: 100%;
	height: 100%;
}
`
document.head.appendChild(style)

const container = document.createElement('div')
container.id = 'root'
document.body.appendChild(container)
const reactRoot = createRoot(container)

const contextSystem = initialiseContextSystem(container)
const parentIntercept: ContextInterceptGroup = {
	'parent-context-type.parent-act': (action) => {
		console.log('Parent Action:', action)
		alert('Parent Action!')
	},
	'child-context-type.child-act': (action) => {
		console.log('Child Action:', action)
		alert('Child Action!')
	},
	'button-context-type.button-activate': (action) => {
		console.log('Button Action:', action)
		alert('Button Action!')
	},
}
const parentContext: ContextConfig = {
	type: 'parent-context-type',
	acts: {
		'parent-act': {}
	},
	menu: [
		{
			action: 'parent-act',
			label: 'Parent Action'
		}
	],
	overrides: {
		'child-context-type': {
			acts: {
				'child-act': {
					keys: ['DoubleClick','Meta+Click']
				},
				'additional-child-act': {
					keys: ['Meta+J']
				}
			},
			menu: [
				{
					action: 'additional-child-act',
					label: 'Extra Child Action'
				}
			]
		}
	}
}
const childContext: ContextConfig = {
	type: 'child-context-type',
	acts: {
		'child-act': {
			keys: ['DoubleClick']
		}
	},
	menu: [
		{
			action: 'child-act',
			label: 'Child Action'
		}
	]
}
const buttonContext: ContextConfig = {
	type: 'button-context-type',
	acts: {
		'button-activate': {
			keys: ['Click']
		},
	},
	menu: [
		{
			label: 'Activate',
			action: 'button-activate'
		}
	]
}

const color = 'white'

function RefComponent(): React.ReactElement {
  const inputRef = useRef(null)
	return <div>
		<Context ref={inputRef} >
			<div onClick={() => {
				console.log(inputRef)
			}} >
				This component uses a ref, clicking it will print the ref in the console
			</div>
		</Context>
	</div>
}

reactRoot.render(
  <SystemContext.Provider value={contextSystem}>
	<Context context={parentContext} intercept={parentIntercept} >
		Parent Context
		<br/>
		<br/>
		<br/>
		<hr/>
		<Context context={childContext} >
			Child Context
			<br/>
			<br/>
			<br/>
			<hr/>
			<div className="test-div">
				Test Div
			</div>
			<br/>
			<br/>
			<br/>
			<hr/>
			<DataContext data={{extraDataGoesWhere3: 457467}} >
				<DataContext data={{extraDataGoesWhere2: 457467}} >
					<Context
						context={buttonContext}
						element="button"
					>
						<DataContext data={{extraDataGoesWhere: 457467}} >
							Test Button
						</DataContext>
					</Context>
				</DataContext>
			</DataContext>
		</Context>
		<div
			css={css`
				padding: 32px;
				background-color: hotpink;
				font-size: 24px;
				border-radius: 4px;
				&:hover {
					color: ${color};
				}
			`}
		>
			Hover to change color.
		</div>
	</Context>
	<RefComponent />

  
  </SystemContext.Provider>
)

