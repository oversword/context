import React from 'react'
import { createRoot } from "react-dom/client"
import { Context, ContextInterceptGroup, SystemContext, initialiseContextSystem } from "../src"

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
const intercept: ContextInterceptGroup = {
  'test-type.test-act': (action) => {
		console.log('Parent Action:', action)
		// alert('Parent Action!')
  },
  'child-type.child-act': (action) => {
		console.log('Child Action:', action)
		// alert('Child Action!')
  },
  'test-button.test-button-activate': (action) => {
		console.log('Button Action:', action)
		// alert('Button Action!')
  },
}
const context = {
	type: 'test-type',
	acts: {
		'test-type': {
			'test-act': {}
		}
	},
	menu: {
		'test-type': [
			{action:'test-act', label: 'Parent Action'}
		]
	}
}
const childContext = {
	type: 'child-type',
	acts: {
		'child-type': {
			'child-act': {}
		}
	},
	keys: {
		'child-type': {
			'child-act': ['DoubleClick']
		}
	},
	menu: {
		'child-type': [
			{action:'child-act', label: 'Child Action'}
		]
	}
}
const buttonContext = {
	type: 'test-button',
	keys: {
		'test-button': {
			'test-button-activate': ['Click']
		}
	},
	acts: {
		'test-button': {
			'test-button-activate': {},
		},
	},
	menu: {
		'test-button': [
			{
				label: 'Activate',
				action: 'test-button-activate'
			}
		]
	}
}
/* self
const context = {
	type: 'test-type',
	self: {
		acts: {
			'test-act': {}
		},
		menu: [
			{action:'test-act', label: 'Parent Action'}
		]
	},
}
const childContext = {
	type: 'child-type',
	self: {
		acts: {
			'child-act': {}
		},
		keys: {
			'child-act': ['DoubleClick']
		},
		menu: [
			{action:'child-act', label: 'Child Action'}
		]
	}
}
const buttonContext = {
	type: 'test-button',
	keys: {
		'test-button': {
			'test-button-activate': ['Click']
		}
	},
	acts: {
		'test-button': {
			'test-button-activate': {},
		},
	},
	menu: {
		'test-button': [
			{
				label: 'Activate',
				action: 'test-button-activate'
			}
		]
	}
}
*/
reactRoot.render(
  <SystemContext.Provider value={contextSystem}>
	<Context context={context} intercept={intercept} >
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
			<Context
				context={buttonContext}
				element="button"
			>
				Test Button
			</Context>
		</Context>
	</Context>
  </SystemContext.Provider>
)