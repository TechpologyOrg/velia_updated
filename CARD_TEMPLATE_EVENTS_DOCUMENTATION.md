# Enhanced CardTemplateController with Event System

## Overview

The enhanced CardTemplateController now includes a powerful event system similar to the TemplateController but specifically designed for card-based layouts. This system enables conditional visibility, dynamic styling, event-driven interactions, and complex component relationships.

## Key Features

### 1. Conditional Visibility System
Components can be shown or hidden based on the values of other components using logical conditions.

### 2. Event-Driven Interactions
Components can trigger actions when interacted with, enabling dynamic behavior.

### 3. Dynamic Styling
Components can change their appearance based on conditions.

### 4. Variable Resolution
Automatic resolution of values from global variables.

## JSON Schema Structure

### Basic Component Structure
```json
{
  "tag": "ComponentType",
  "type": "Editable|display",
  "title": "Component Label",
  "value": "Current Value",
  "var": "variable_name",
  "class": "css-classes",
  "visibleWhen": { /* visibility conditions */ },
  "styleWhen": { /* styling conditions */ },
  "onClick": { /* event handler */ },
  "children": [ /* child components */ ]
}
```

## Visibility System

### Single Condition
```json
{
  "visibleWhen": {
    "path": "0.1",
    "op": "equals",
    "value": "some_value"
  }
}
```

### OR Logic (anyOf)
```json
{
  "visibleWhen": {
    "anyOf": [
      {"path": "0.1", "op": "equals", "value": "option1"},
      {"path": "0.1", "op": "equals", "value": "option2"}
    ]
  }
}
```

### AND Logic (allOf)
```json
{
  "visibleWhen": {
    "allOf": [
      {"path": "0.1", "op": "equals", "value": "employed"},
      {"path": "0.2", "op": "greaterThan", "value": "18"}
    ]
  }
}
```

### NOT Logic
```json
{
  "visibleWhen": {
    "not": {"path": "0.1", "op": "equals", "value": "student"}
  }
}
```

## Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | String equality | `"status" equals "completed"` |
| `notEquals` | String inequality | `"status" notEquals "pending"` |
| `contains` | String contains | `"description" contains "bug"` |
| `notContains` | String does not contain | `"title" notContains "draft"` |
| `greaterThan` | Numeric greater than | `"age" greaterThan "18"` |
| `lessThan` | Numeric less than | `"score" lessThan "100"` |
| `greaterThanOrEqual` | Numeric >= | `"priority" greaterThanOrEqual "5"` |
| `lessThanOrEqual` | Numeric <= | `"count" lessThanOrEqual "10"` |
| `isEmpty` | Value is empty | `"notes" isEmpty` |
| `isNotEmpty` | Value has content | `"email" isNotEmpty` |
| `isTrue` | Boolean true | `"active" isTrue` |
| `isFalse` | Boolean false | `"disabled" isFalse` |

## Path Formats

### Component Path
- `"0.1"` - Array index 0, child index 1
- `"0.2.1"` - Nested component path

### Component ID
- `"component_id"` - Reference by component ID

### Variable Reference
- `"vars.variable_name"` - Reference global variable

## Event System

### Event Handler Structure
```json
{
  "onClick": {
    "action": "action_type",
    "target": "target_path",
    "value": "action_value"
  }
}
```

### Supported Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `save` | Save current card state | `target: "parent"` |
| `reset` | Reset component values | `target: "parent"` |
| `update` | Update target component value | `target: "path", value: "new_value"` |
| `toggle` | Toggle component visibility | `target: "path"` |
| `navigate` | Navigate to URL | `value: "https://example.com"` |
| `custom` | Custom action | Requires custom handler |

### Event Examples

#### Save Action
```json
{
  "tag": "I_V_Button",
  "title": "Save",
  "onClick": {
    "action": "save",
    "target": "parent"
  }
}
```

#### Update Component Value
```json
{
  "tag": "I_V_Button",
  "title": "Mark Complete",
  "onClick": {
    "action": "update",
    "target": "0.2",
    "value": "completed"
  }
}
```

#### Navigate to URL
```json
{
  "tag": "Ibutton",
  "title": "View Details",
  "onClick": {
    "action": "navigate",
    "value": "https://example.com/details"
  }
}
```

## Dynamic Styling

### Style When Condition
```json
{
  "tag": "Itext",
  "title": "Status",
  "value": "pending",
  "styleWhen": {
    "path": "0.1",
    "op": "equals",
    "value": "completed",
    "style": "text-green-600 font-bold"
  }
}
```

## Component Types

### Interactive Components

#### Itext
```json
{
  "tag": "Itext",
  "type": "Editable",
  "title": "Field Label",
  "value": "",
  "var": "variable_name",
  "class": "css-classes"
}
```

#### IBool
```json
{
  "tag": "IBool",
  "type": "Editable",
  "title": "Checkbox Label",
  "value": "false",
  "class": "css-classes"
}
```

#### IChoice
```json
{
  "tag": "IChoice",
  "type": "Editable",
  "title": "Dropdown Label",
  "value": "",
  "choices": ["option1", "option2", "option3"],
  "class": "css-classes"
}
```

#### IToggle
```json
{
  "tag": "IToggle",
  "type": "Editable",
  "title": "Toggle Group",
  "value": "",
  "options": ["option1", "option2", "option3"],
  "class": "css-classes"
}
```

#### Imultiline
```json
{
  "tag": "Imultiline",
  "type": "Editable",
  "title": "Textarea Label",
  "value": "",
  "class": "css-classes"
}
```

#### Ibutton
```json
{
  "tag": "Ibutton",
  "type": "Editable",
  "title": "Button Text",
  "value": "https://example.com",
  "var": "variable_name",
  "class": "css-classes"
}
```

#### I_V_Button
```json
{
  "tag": "I_V_Button",
  "type": "Editable",
  "title": "Advanced Button",
  "value": "https://example.com",
  "variant": "default|destructive|outline|secondary|ghost|link|warning|success|outline-destructive",
  "size": "default|sm|lg|icon",
  "var": "variable_name",
  "class": "css-classes"
}
```

### HTML Elements
```json
{
  "tag": "div",
  "class": "flex flex-col gap-4",
  "children": [
    // child components
  ]
}
```

## Usage Example

```jsx
import React, { useState } from 'react';
import { CardTemplateRenderer } from './controllers/CardTemplateController';

function MyCardComponent() {
  const [cardJson, setCardJson] = useState([
    {
      "tag": "div",
      "class": "flex flex-col gap-4 p-4",
      "children": [
        {
          "tag": "Itext",
          "type": "Editable",
          "title": "Name",
          "value": "",
          "var": "customer_name"
        },
        {
          "tag": "IChoice",
          "type": "Editable",
          "title": "Status",
          "value": "",
          "choices": ["pending", "completed"]
        },
        {
          "tag": "div",
          "class": "p-2 bg-green-100",
          "visibleWhen": {
            "path": "0.1",
            "op": "equals",
            "value": "completed"
          },
          "children": [
            {
              "tag": "p",
              "value": "Task completed!"
            }
          ]
        },
        {
          "tag": "I_V_Button",
          "type": "Editable",
          "title": "Save",
          "onClick": {
            "action": "save",
            "target": "parent"
          }
        }
      ]
    }
  ]);

  const globalVars = {
    "customer_name": "John Doe"
  };

  const handleSave = (updatedCard) => {
    console.log('Card saved:', updatedCard);
  };

  return (
    <CardTemplateRenderer
      jsonTemplate={cardJson}
      globalVars={globalVars}
      onChange={setCardJson}
      onSave={handleSave}
    />
  );
}
```

## Advanced Features

### Custom Event Handlers
```jsx
const handleCustomEvent = (event, template, setTemplate, globalVars, onSave) => {
  switch (event.action) {
    case 'custom_action':
      // Handle custom action
      break;
    default:
      // Use default handling
      break;
  }
};

<CardTemplateRenderer
  jsonTemplate={cardJson}
  globalVars={globalVars}
  onChange={setCardJson}
  onSave={handleSave}
  onEvent={handleCustomEvent}
/>
```

### Complex Conditional Logic
```json
{
  "visibleWhen": {
    "allOf": [
      {
        "anyOf": [
          {"path": "0.1", "op": "equals", "value": "bug"},
          {"path": "0.1", "op": "equals", "value": "feature"}
        ]
      },
      {"path": "0.2", "op": "isNotEmpty"}
    ]
  }
}
```

## Best Practices

1. **Use meaningful component IDs** for better path references
2. **Keep conditions simple** to avoid performance issues
3. **Test visibility logic** thoroughly with different data states
4. **Use CSS classes** for consistent styling
5. **Handle events gracefully** with proper error handling
6. **Document complex conditional logic** for maintainability

## Migration from Basic CardTemplateController

The enhanced system is backward compatible. Existing card templates will work without modification. To add event functionality:

1. Add `visibleWhen` conditions to components that should be conditional
2. Add `onClick` handlers to interactive components
3. Add `styleWhen` conditions for dynamic styling
4. Update component usage to include event handlers

## Performance Considerations

- Visibility conditions are evaluated using `useMemo` for optimal performance
- Deep cloning is used to prevent state mutation issues
- Event handlers are optimized to prevent unnecessary re-renders
- Complex nested conditions may impact performance with large templates

