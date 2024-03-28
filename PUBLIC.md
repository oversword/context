# React ContextMenus
## <a name="basics"></a>Basic Behaviour

### <a name="basics-context"></a>Context (with element)
The `Context` component will create an element for you, passing the children and attributes given to the `Context` component onto the created element.
* Properties used by the context system will be intercepted and not passed on to the rendered component, or they may be modified before being passed on. [See the full list of property behaviours.](#property-behaviours)
* The created element will become [focussable](#component-properties-advanced-focus) by default, and will gain the ability to create a ContextMenu if [one is configured](#config-context-menus).

```jsx
<Context className="Some-Class" title="Other Attributes" >
  <div>
    Child
  </div>
  <div>
    Components!
  </div>
</Context>
```
Results in:
```jsx
<div class="Some-Class Context-Focus" title="Other Attributes" tabindex="0" data-contextid="42" >
  <div>
    Child
  </div>
  <div>
    Components!
  </div>
</div>
```

### <a name="basics-data-context"></a>DataContext (without element)
The `DataContext` component will not create an element, and should be used only as a wrapper for other elements. The children will be rendered as normal, unaffected.
```jsx
<DataContext>
  <div>
    Child
  </div>
  <div>
    Components!
  </div>
</DataContext>
```
Results in:
```jsx
<div>
  Child
</div>
<div>
  Components!
</div>
```


## <a name="config"></a>Configuration
Typically, to make use of the context functionality, you will want to pass one or more of these properties to the `Context` or `DataContext` components.

Making a context will attach the it to the context tree, with the context containing it becoming the parent. Events will be bubbled up this tree, and configuration will be passed down from this tree.

To avoid this, mark it with the `root` flag. This Context will become the root of its own tree.
```jsx
<Context root >
  Contents
</Context>
<DataContext root >
  Contents
</DataContext>
```

### <a name="config-context"></a>Context Configuration
The context can be passed in as `context` - or by the name of the component: `Context` and `DataContext` respectively, for special reasons which will not be justified here.

* The context is an object which may contain any of the following properties as needed.

#### <a name="config-context-type"></a>Context Type
Though not required, the most basic context would only define its own type.
```jsx
const context = {
  type: 'my-label-type',
}
<Context context={context} >
  Contents
</Context>
/* OR */
<DataContext context={context} >
  Contents
</DataContext>
```

#### <a name="config-context-acts"></a>Context Acts
You can provide the `acts` property, which will define which actions are possible for this type.
```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {},
  }
}
<Context context={context} >
  Contents
</Context>
/* OR */
<DataContext context={context} >
  Contents
</DataContext>
```

You can override `acts` in parent contexts
```jsx
const wrapperContext = {
  overrides: {
    'my-label-type': {
      acts: {
        'override-action': {}
      }
    }
  }
}
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {
      disabled: () => Boolean(Math.round(Math.random()))
    },
  }
}
<DataContext context={wrappercontext} >
  <Context context={context} >
    Contents
  </Context>
</DataContext>
```

##### <a name="config-context-acts-conditions"></a>Context Acts Conditions
Acts can have conditions configured, which will determine whether or not they are allowed to fire.

* If the `condition` property is `false`, or returns `false` on evaluation, the action will not exist on the context, and will not be triggerable. Any attempt to trigger this action will result in the `UNHANDLED` Symbol.
* If the `disabled` property is `true`, or returns `true` on evaluation, the action will exist, but will not trigger. Triggering this action will result in the `HANDLED` symbol, preventing other contexts from intercepting the action, and will not trigger the handlers associated with the action.
```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {
      condition: ({ type, action, path, data, event }) =>
        Boolean(Math.round(Math.random()))
    },
    'another-action': {
      disabled: ({ type, action, path, data, event }) =>
        Boolean(Math.round(Math.random()))
    },
  }
}
<Context context={context} >
  Contents
</Context>
/* OR */
<DataContext context={context} >
  Contents
</DataContext>
```

##### <a name="config-context-acts-keys"></a>Context Acts Keys
```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {
      keys: ['Click']
    },
    'another-action': {},
  },
}
<Context context={context} >
  Contents
</Context>
```

You can also override `keys` in parent contexts
```jsx
const wrapperContext = {
  overrides: {
    'my-label-type': {
      acts: {
        'some-action': {
          keys: ['Click','Enter']
        }
      }
    }
  }
}
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {
      keys: ['Ctrl+L']
    },
    'another-action': {},
  },
  menu: [
    {
      action: 'some-action',
      label: 'Trigger Some Action',
    },
    {
      action: 'another-action',
      label: 'Do Another Action',
    }
  ],
}
<DataContext context={wrappercontext} >
  <Context context={context} >
    Contents
  </Context>
</DataContext>
```

#### <a name="config-context-menus"></a>Context Menus
You can provide the `menu` property, which will define the display of the context menu.
* The acts each menu item references must be configured for the specific type. If the action referenced does not exist, the menu item will not display in the menu at all.

```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {},
  },
  menu: [
    {
      action: 'some-action',
      label: 'Trigger Some Action',
    },
    {
      action: 'another-action',
      label: 'Do Another Action',
    }
  ]
}
<Context context={context} >
  Contents
</Context>
```

You can override `menu` in parent contexts
```jsx
const wrapperContext = {
  overrides: {
    'my-label-type': {
      menu: [
        {
          action: 'override-action',
          label: 'Overriding Menu Item'
        }
      ]
    }
  }
}
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {},
  },
  menu: [
    {
      action: 'some-action',
      label: 'Trigger Some Action',
    },
    {
      action: 'another-action',
      label: 'Do Another Action',
    }
  ]
}
<DataContext context={wrappercontext} >
  <Context context={context} >
    Contents
  </Context>
</DataContext>
```

Menu items can be grouped by using the "section" mode, and providing children
```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {},
  },
  menu: [
    {
      action: 'some-action',
      label: 'Trigger Some Action',
    },
    {
      label: 'Action List',
      mode: 'section',
      children: [
        {
          action: 'another-action',
          label: 'Do Another Action',
        }
      ]
    }
  ]
}
<Context context={context} >
  Contents
</Context>
```

Menus can be nested by using the "branch" mode, and providing children
```jsx
const context = {
  type: 'my-label-type',
  acts: {
    'some-action': {},
    'another-action': {},
  },
  menu: [
    {
      action: 'some-action',
      label: 'Trigger Some Action',
    },
    {
      label: 'Additional Actions...',
      mode: 'branch',
      children: [
        {
          action: 'another-action',
          label: 'Do Another Action',
        }
      ]
    }
  ]
}
<Context context={context} >
  Contents
</Context>
```

### <a name="config-data"></a>Data Configuration
Data an be provided to a context, which will become the data available on the action object. This is where you can provide contextual data that will be used when handling the action.

The data should be a normal object with string keys, it may be single-level merged with other data under this assumption. The types of values associated with those keys will not affect the system.
```jsx
<Context data={{
  MyContext_info: 'something-important',
}} >
  Contents
</Context>
```

Using a data-only context is an obvious use-case for a `DataContext` component, this example also removes the burden of the sub-component holding the `key` metadata.

The data given here can later be used to identify the source component's model.
```jsx
<Component>
  {someList.map(({ label, key }) => (
    <DataContext
      key={key}
      data={{
        MyContext_info: 'something-important',
        MyContext_key: key,
      }} >
      <SubComponent name={label} />
    </DataContext>
  ))}
</Component>
```

The data can also be provided by a generator function, this can also be used for custom merging strategies if the default merging strategy is not desired. The generator will not be evaluated until an action is triggered.
```jsx
<Context data={({ action, type, path, event }, currentData) => ({
  ...currentData,
  Existing_key: undefined,
  MyContext_info: 'something-important',
})} >
  Contents
</Context>
```

### <a name="config-intercept"></a>Intercept Configuration
An `intercept` property can be provided to the context in order to catch and handle actions bubbling up from child components.

```jsx
const subComponentContext = {
  type: 'sub-component',
  acts: {
    'some-action': {
      keys: ['Click','Enter']
    }
  },
}
const SubComponent = ({ name }) => (
  <Context context={subComponentContext}>
    {name}
  </Context>
)

const parentIntercept = {
  'sub-component.some-action': ({ type, path, action, data, event }) => {
    console.log(data)
    /*
    {
      MyContext_info: 'something-important',
      MyContext_key: key,
    }
    */
  }
}
<DataContext intercept={parentIntercept} >
  {someList.map(({ label, key }) => (
    <DataContext
      key={key}
      data={{
        MyContext_info: 'something-important',
        MyContext_key: key,
      }} >
      <SubComponent name={label} />
    </DataContext>
  ))}
</DataContext>
```

Intercepts can also be defined as other actions, triggering them from the intercepting context.
```jsx
const subComponentContext = {
  type: 'sub-component',
  acts: {
    'some-action': {
      keys: ['Click','Enter']
    }
  },
}
const SubComponent = ({ name }) => (
  <Context context={subComponentContext}>
    {name}
  </Context>
)

const parentContext = {
  type: 'parent-component',
  acts: {
    'parent-action': {}
  },
}
const parentIntercept = {
  'sub-component.some-action': 'parent-action'
}
<Context context={parentContext} intercept={parentIntercept} >
  {someList.map(({ label, key }) => (
    <DataContext
      key={key}
      data={{
        MyContext_info: 'something-important',
        MyContext_key: key,
      }} >
      <SubComponent name={label} />
    </DataContext>
  ))}
</Context>
```

#### <a name="config-intercept-outercept"></a>Outercepts
Using the `outercept` property will be effectively the same as the `intercept` property, except that action priorities will "bubble down". Everything else should behave as if the action has "bubbled up", but the order in which actions are caught will start at the root ancestor and work down (the opposite of `intercept`), allowing you to completely override descendant behaviour from any ancestor context.

Outercepts will always be prioritised over intercepts unless the outercepts go unhandled.
```jsx
const subComponentContext = {
  type: 'sub-component',
  acts: {
    'some-action': {
      keys: ['Click','Enter']
    }
  },
}
const subComponentIntercept = {
  'sub-component.some-action': ({ type, path, action, data, event }) => {
    // Handles it's own action?
  }
}
const SubComponent = ({ name }) => (
  <Context context={subComponentContext} intercept={subComponentIntercept} >
    {name}
  </Context>
)

const parentOutercept = {
  'sub-component.some-action': ({ type, path, action, data, event }) => {
    // Action is overriden by ancestor!
    // Descendant handler will never call
  }
}
<DataContext outercept={parentOutercept} >
  {someList.map(({ label, key }) => (
    <DataContext
      key={key}
      data={{
        MyContext_info: 'something-important',
        MyContext_key: key,
      }} >
      <SubComponent name={label} />
    </DataContext>
  ))}
</DataContext>
```
* Note this `outercept` feature is overpowered, ripe for contraversy, and may one day be removed



## <a name="component-properties"></a>Context Component Properties
The following properties should only be passed to the `Context` component, as they all imply the existence of an element the context is associated with.
This is not true for the `DataContext` component, which should only (but always) be used when there is no associated element.

### <a name="component-properties-advanced"></a>Advanced Component Configuration

#### <a name="component-properties-advanced-element"></a>`element`
The component that is rendered can be customised using the `element` property.
```jsx
<Context element="button" >
  Button Label
</Context>
```
Results in:
```jsx
<button class="Context-Focus" tabindex="0" data-contextid="42" >
  Button Label
</button>
```

You can also use existing React components, passing down any properties in the same way as attributes.
```jsx
<Context element={ReactComponent} property="Component Property" >
  Component Contents
</Context>
```
Results in:
```jsx
<ReactComponent className="Context-Focus" property="Component Property" tabindex="0" data-contextid="42" >
  Component Contents
</ReactComponent>
```

#### <a name="component-properties-advanced-focus"></a>`focus`
You can make the element unfocussable by switching off the `focus` property, which is `true` by default.
```jsx
<Context focus={false} >
  Contents
</Context>
```
Results in:
```jsx
<div data-contextid="42" >
  Contents
</div>
```

#### <a name="component-properties-advanced-tabIndex"></a>`tabIndex`
You can customise the focus order of elements by passing in the `tabIndex` property, this will be `0` by default.
```jsx
<Context tabIndex={3} >
  Contents
</Context>
```
Results in:
```jsx
<div tabindex="3" data-contextid="42" >
  Contents
</div>
```

### <a name="component-properties-event-actions"></a>Event Actions
This feature is redundant, and not recomended. You should configure mouse events to trigger actions by [configuring context keys](#config-context-keys) in the same way as keyboard "buttons". [Valid mouse "keys"](#valid-keys-mouse) are `Click`, `DoubleClick`, `Button1`, `Button2`, `Button3`, `Button4`, `Button5`.

These properties can be used to bind actions directly to the rendered element events. When the event occurs, the action will be triggered.
```
onChangeAction
onClickAction
onDoubleClickAction
onMouseDownAction
onMouseUpAction
onMouseMoveAction
```

The action can be defined as:
* A string, the name of the action to be triggered
  `onDoubleClickAction="action-name"`
* A function, returning the name of the action. Any existing iformation about the action will be passed as the first argument, including the source event.
  `onClickAction={({ data, type, path, event }) => 'action-name'}`
* An object, containing a `condition` property and `action` property, which may itself be a string or a function.
  * Using simple data:
    ```
    onMouseDownAction={{
      condition: someVar > 7,
      action: 'action-name'
    }}
    ```
  * Using generative functions (will be evaluated only when the event is triggered):
    ```
    onMouseDownAction={{
      condition: ({ data, type, path, event }) =>
        Boolean(event.target.closest('.target-element')),
      action: ({ data, type, path, event }) =>
        'action-name'
    }}
    ```



## <a name="property-behaviours"></a>Property Behaviours

Properties that will be intercepted, and not passed through to the rendered component:
```
root
focus
element
Context/context
data
intercept
outercept
onClickAction
onDoubleClickAction
onMouseDownAction
onMouseUpAction
onMouseMoveAction
```

Properties that may be modfied before passing them through to the rendered component:
```
tabIndex
onFocus
className
```

Properties that will be overridden, even if they are passed through to the rendered component:
```
ref
data-contextid

onContextMenu (if the Context is focussable)

onClick       (if onClickAction is provided)
onDoubleClick (if onDoubleClickAction is provided)
onMouseMove   (if onMouseMoveAction is provided)
onMouseDown   (if onMouseDownAction is provided)
onMouseUp     (if onMouseUpAction is provided)
```



## <a name="valid-keys"></a>Valid Keys
These keys, "buttons" or "symbols" will be available for [configuring the `keys`](#config-context-keys) property of a `context`, and can all be used in combination with each other to define key combinations that trigger actions.

* Thas has all been configured with UK Mac keyboards in mind, and is not customisable yet, behaviour on other keyboards may be unoptimal.

### <a name="valid-keys-mouse"></a>Mouse buttons
```
Click
DoubleClick
Button1 (left mouse button)
Button2 (middle mouse button, press scroll button)
Button3 (right mouse button)
Button4 (uncommon; scrolling up/down or browser back/forth)
Button5 (uncommon; scrolling up/down or browser back/forth)
```

### <a name="valid-keys-keyboard"></a>Keyboard
These symbols will not depend on positional key information e.g. CtrlLeft/CtrlRight

```
Ctrl
Shift
CapsLock
Meta (windows key, or command on mac)
Alt (option on mac)

Enter
Space
Tab
Delete
Backspace

ArrowLeft
ArrowRight
ArrowUp
ArrowDown

IntlBackslash (unadvised: the position, appearance, and expected behaviour of this key are not predictable between keyboards)
```
* Note the Function (fn) key cannot be intercepted at the browser level at all. Symbols that require the Function key to be accessed will report as if they are actually that symbol, and will contain no information about the symbol it would have been without the Function key being pressed.

#### <a name="valid-keys-keyboard-letters"></a>The letters, as capitals
```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
```

#### <a name="valid-keys-keyboard-function"></a>The function keys
```
F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12
```

#### <a name="valid-keys-keyboard-numbers"></a>The numbers
```
1 2 3 4 5 6 7 8 9 0
```

#### <a name="valid-keys-keyboard-symbols"></a>The symbols which can be accessed without holding shift
```
- = [ ] ; ' \ ` , . /
```

#### <a name="valid-keys-keyboard-numpad"></a>In addition, only on the numpad
```
+ *
```