# @open-email/editor

The open-source visual email editor for modern React applications.

## Features

- 🎨 **Visual Builder**: Drag-and-drop interface
- ⚛️ **React Email**: Built on top of React Email components
- 📱 **Responsive**: Mobile-friendly email templates
- 🔧 **Customizable**: Extensible component registry
- 📤 **Export**: HTML, JSON, and React code export
- **Variables**: Insert `{{variableName}}` in content with unique keys and fallbacks; resolve at render time

## Installation

```bash
npm install @open-email/editor
# or
yarn add @open-email/editor
# or
pnpm add @open-email/editor
```

## Usage

```tsx
import { EmailEditor, EditorProvider } from "@open-email/editor";
import "@open-email/editor/styles.css";

export default function MyEditor() {
  return (
    <EditorProvider>
      <EmailEditor />
    </EditorProvider>
  );
}
```

## Variables

Templates can use **variables** so content is filled at render time. Each variable has a unique key and a **fallback**; if no value is provided when rendering, the fallback is used.

- **Syntax**: `{{variableName}}` in text, heading, link, or button content.
- **Document**: Define variables on the document with fallbacks:
  ```ts
  document.variables = {
    userName: { fallback: "there" },
    companyName: { fallback: "Open Email" },
  };
  ```
- **Rendering**: Pass values when generating HTML so variables are replaced; missing keys use the fallback.
  ```ts
  import { renderToHTML } from "@open-email/editor";

  const html = await renderToHTML(document, {
    userName: "Alex",
    companyName: "Acme Inc",
  });
  ```
- **Editor**: When editing text/heading/link/button components, use the "Insert variable" combobox to search existing variables or create new ones inline. Variables are inserted as `{{name}}` in your content.
- **Hook**: Access variables programmatically:
  ```ts
  import { useVariables } from "@open-email/editor";
  
  function MyComponent() {
    const variables = useVariables(); // Record<string, { fallback: string }>
    // Use variables to build UI, validate, etc.
  }
  ```

## Documentation

For full documentation, visit [our docs](https://open-email.mintlify.app) (or your hosted docs URL).

## License

MIT
