# @open-email/editor

The open-source visual email editor for modern React applications.

## Features

- 🎨 **Visual Builder**: Drag-and-drop interface
- ⚛️ **React Email**: Built on top of React Email components
- 📱 **Responsive**: Mobile-friendly email templates
- 🔧 **Customizable**: Extensible component registry
- 📤 **Export**: HTML, JSON, and React code export

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

## Documentation

For full documentation, visit [our docs](https://open-email.mintlify.app) (or your hosted docs URL).

## License

MIT
