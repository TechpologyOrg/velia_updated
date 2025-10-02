# Hint Feature Documentation

## Overview

The hint feature adds contextual help tooltips to form fields in the template generator. Users can hover over or focus on a question mark icon next to field labels to see helpful information about what each field is for.

## How to Use

### In TemplateController Forms

Add a `hint` property to any question object in your form template:

```json
{
  "id": 1,
  "title": "Email Address",
  "type": "text",
  "value": "",
  "hint": "Enter your email address for account verification and notifications"
}
```

### In Individual Template Components

Pass a `hint` prop to any of the supported template components:

```jsx
import { Itext, IChoice, IBool, Imultiline } from './components/template';

<Itext 
  title="Customer Name"
  value={customerName}
  hint="Enter the full legal name of the customer"
  onChange={setCustomerName}
/>
```

## Supported Components

The hint feature works with all interactive form components:

- **Itext** - Single-line text inputs
- **IChoice** - Dropdown selections
- **IBool** - Checkboxes
- **Imultiline** - Multi-line text areas
- **TemplateController form types**:
  - `text` - Text inputs
  - `numeric` - Number inputs
  - `choice` - Dropdown selections
  - `boolean` - Checkboxes
  - `date` - Date pickers
  - `display` - Read-only display fields
  - `toggleList` - Multiple selection checkboxes

## Tooltip Behavior

- **Trigger**: Hover over or focus the question mark icon
- **Position**: Tooltip appears above the icon by default
- **Styling**: Dark background with white text, rounded corners
- **Accessibility**: Keyboard accessible with focus/blur events
- **Responsive**: Automatically positions to stay within viewport

## Example Usage

### Basic Form with Hints

```json
{
  "id": 0,
  "title": "User Registration",
  "type": "form",
  "questions": [
    {
      "id": 1,
      "title": "Full Name",
      "type": "text",
      "value": "",
      "hint": "Enter your full legal name as it appears on official documents"
    },
    {
      "id": 2,
      "title": "Email",
      "type": "text",
      "value": "",
      "hint": "We'll use this email to send you important updates and notifications"
    },
    {
      "id": 3,
      "title": "Country",
      "type": "choice",
      "value": "",
      "choices": ["US", "Canada", "UK", "Germany"],
      "hint": "Select your country of residence for localized content"
    },
    {
      "id": 4,
      "title": "Subscribe to Newsletter",
      "type": "boolean",
      "value": "false",
      "hint": "Check this box to receive our weekly newsletter with tips and updates"
    }
  ]
}
```

### Advanced Example with Conditional Hints

```json
{
  "id": 1,
  "title": "Employment Details",
  "type": "form",
  "visibleWhen": {
    "path": "0.3",
    "op": "equals",
    "value": "employed"
  },
  "questions": [
    {
      "id": 5,
      "title": "Job Title",
      "type": "text",
      "value": "",
      "hint": "Your current job title or position at your company"
    },
    {
      "id": 6,
      "title": "Years of Experience",
      "type": "numeric",
      "value": 0,
      "hint": "Total years of professional experience in your field"
    }
  ]
}
```

## Implementation Details

### V_Tooltip Component

The tooltip functionality is provided by the `V_Tooltip` component located at `src/components/V_Tooltip.js`.

**Props:**
- `hint` (string, required) - The tooltip content
- `position` (string, optional) - Tooltip position: 'top', 'bottom', 'left', 'right' (default: 'top')
- `className` (string, optional) - Additional CSS classes
- `children` (ReactNode, optional) - Custom trigger element (defaults to question mark icon)

### Integration Points

1. **TemplateController**: Uses `renderLabel()` helper function to add tooltips to all form field types
2. **Individual Components**: Each component imports and uses `V_Tooltip` directly in their label rendering
3. **Examples**: Updated `CardTemplateExample.js` demonstrates the feature with realistic hints

## Best Practices

1. **Keep hints concise** - Aim for 1-2 sentences maximum
2. **Be specific** - Explain what the field is used for, not just what it is
3. **Use consistent tone** - Match your application's voice and style
4. **Provide context** - Explain why the information is needed when relevant
5. **Test accessibility** - Ensure tooltips work with keyboard navigation

## Browser Support

The hint feature uses modern CSS and JavaScript features:
- CSS `position: absolute` for tooltip positioning
- CSS `transform` for centering
- React hooks for state management
- Event listeners for hover/focus interactions

Compatible with all modern browsers (Chrome, Firefox, Safari, Edge).

## Testing

Use the `TestHintFeature` component (`src/components/TestHintFeature.js`) to test the hint functionality with various field types and scenarios.
