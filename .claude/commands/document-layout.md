---
description: Generate documentation for a CSS layout component
---

You are creating documentation for a Preschool CSS layout component.

## Task
Generate a comprehensive documentation page in MDX format for the specified CSS layout file.

## Input Format
The user will provide either:
1. A file path to a CSS layout file (e.g., `src/styles/layout/stack.css`)
2. Just the component name (e.g., "stack"), and you'll look for it in `src/styles/layout/`

## Steps

1. **Read the CSS file** - Analyze the component's structure, custom properties, and modifiers
2. **Extract key information**:
   - Component purpose (from header comment)
   - Default behavior
   - Custom properties (both public `--component-*` and private `--_component-*`)
   - Modifier classes and their values
   - Special variants or options

3. **Generate MDX documentation** at `/Users/kurt/Websites/framework/preschool/docs/src/content/docs/layouts/{component-name}.mdx` with:
   - Frontmatter (title, description)
   - Import statement: `import Iframe from '../../../components/Iframe.astro';`
   - Overview paragraph
   - **Basic Usage** section with HTML example and Iframe demo
   - **Default Behavior** bullet list
   - Sections for each modifier category (e.g., Width, Spacing, Variants)
   - **Common Examples** section (2-3 realistic use cases)
   - **Customization** section showing CSS custom property overrides
   - **Accessibility** section with semantic HTML guidance
   - **How It Works** technical explanation (optional, for complex layouts)

4. **Documentation Style Guidelines**:
   - Use clear, concise language
   - Provide HTML code examples before each Iframe demo
   - In Iframe demos, use inline styles for visualization: `border: 1px solid #ccc;`, `background: #f0f0f0;`, `padding: 1rem;`
   - Show modifier classes with comments indicating their purpose (e.g., `<!-- ~240px - narrow nav -->`)
   - Include realistic examples in "Common Examples" section
   - Keep customization examples practical and commonly needed

5. **Iframe Demo Format**:
```html
<Iframe>
    <div class="component-name modifier-class" style="border: 1px solid #ccc;">
        <div style="background: #f0f0f0; padding: 1rem;">Example content</div>
    </div>
</Iframe>
```

6. **Do NOT**:
   - Create TODO lists (this is a simple task)
   - Ask for confirmation before creating the file
   - Include emojis
   - Over-explain - be concise and practical

## Example Structure

```mdx
---
title: Component Name
description: Brief one-line description
---

import Iframe from '../../../components/Iframe.astro';

Overview paragraph explaining what this layout does and when to use it.

## Basic Usage

HTML example...

<Iframe>Demo...</Iframe>

## Default Behavior
- Bullet points...

## [Modifier Category]
Explanation and examples...

## Common Examples
### Use Case 1
### Use Case 2

## Customization
CSS custom property examples...

## Accessibility
Semantic HTML guidance...
```

## Output
After creating the documentation file, tell the user:
1. The file path where documentation was created
2. A brief summary of what was documented (key modifiers, variants)
3. Remind them the page will auto-appear in the "Layouts" section of the docs sidebar

Be efficient with tokens - read only what's needed, don't duplicate information unnecessarily.
