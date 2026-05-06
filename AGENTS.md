# AGENTS.md

You are an expert in JavaScript, Rsbuild, and web application development. You write maintainable, performant, and accessible code.

## Skills

### UI Analyzer

**Description:** Analyze UI design screenshots and generate React components with TypeScript and Tailwind CSS using your project's tech stack (Radix UI, Lucide icons, class-variance-authority). Use this skill when the user provides UI mockups, design screenshots, or Figma exports and requests implementation.

**Allowed Tools:** Read, Write, Edit, Glob, Grep, AskUserQuestion

#### When to Use

Use this skill when users provide:
- UI design screenshots/mockups
- Figma exports or wireframes
- "Implement this design" requests
- "Build this UI" requests
- Requests to analyze or convert designs to code

#### Quick Analysis Workflow

1. **Screenshot Review**
   - Read the image using Read tool if file path provided
   - Describe what you see: layout, components, colors, typography
   - Identify screen type: dashboard, form, landing page, etc.
   - Note device target: desktop, mobile, or responsive
   - Confirm understanding with user before proceeding

2. **Layout Analysis**
   - Identify structure: header/sidebar layout, grid, cards, centered content
   - Break into sections: navigation, main content, sidebars, footer
   - Consider responsiveness: mobile stacking, breakpoint behavior
   - Reference patterns: Use established layouts from your codebase

3. **Component Inventory**
   Quickly identify all UI elements:
   - Navigation: headers, sidebars, breadcrumbs, tabs
   - Data display: cards, tables, stats, avatars, badges
   - Inputs: text fields, selects, checkboxes, buttons
   - Feedback: alerts, loading states, progress bars
   - Overlays: modals, tooltips, dropdowns

4. **Design Token Extraction**
   Map visual elements to your tech stack:

   **Colors → Tailwind classes:**
   - Primary: `bg-blue-600`, `text-blue-600`
   - Backgrounds: `bg-gray-50`, `bg-white`
   - Text: `text-gray-900`, `text-gray-600`, `text-gray-400`
   - States: `bg-green-600` (success), `bg-red-600` (error)

   **Typography → Tailwind scale:**
   - Headings: `text-2xl font-semibold`, `text-lg font-medium`
   - Body: `text-sm`, `text-base`
   - Weights: `font-normal`, `font-medium`, `font-semibold`

   **Spacing → Tailwind scale:**
   - Padding: `p-4`, `p-6`, `p-8`
   - Margins: `m-2`, `mb-4`, `mt-8`
   - Gaps: `gap-4`, `gap-6`, `space-y-4`

   **Components → Radix UI + Tailwind:**
   - Buttons: Radix `Button` with `class-variance-authority` variants
   - Dialogs: Radix `Dialog` with custom overlay styling
   - Icons: Lucide React icons (`IconName` from 'lucide-react')

5. **Component Generation Strategy**

   **Use established patterns from your codebase:**
   - Follow existing component structure (check `src/components/`)
   - Use `class-variance-authority` for component variants
   - Leverage Radix UI primitives with custom Tailwind styling
   - Include Lucide icons where appropriate

   **Component template structure:**
   ```tsx
   import React from 'react';
   import { cva, type VariantProps } from 'class-variance-authority';
   import { cn } from '@/lib/utils';

   const componentVariants = cva(
     'base-classes',
     {
       variants: {
         variant: {
           default: '',
           secondary: '',
         },
         size: {
           default: '',
           sm: '',
           lg: '',
         },
       },
       defaultVariants: {
         variant: 'default',
         size: 'default',
       },
     }
   );

   export interface ComponentNameProps
     extends React.HTMLAttributes<HTMLDivElement>,
       VariantProps<typeof componentVariants> {
     title?: string;
     loading?: boolean;
   }

   export const ComponentName = React.forwardRef<
     HTMLDivElement,
     ComponentNameProps
   >(({ className, variant, size, title, loading, ...props }, ref) => {
     return (
       <div
         ref={ref}
         className={cn(componentVariants({ variant, size }), className)}
         {...props}
       >
         {loading ? (
           <div className="animate-pulse">Loading...</div>
         ) : (
           title && <h3 className="text-lg font-semibold">{title}</h3>
         )}
       </div>
     );
   });

   ComponentName.displayName = 'ComponentName';
   ```

#### Common Implementation Scenarios

**Form Component:**
```tsx
import { Label } from '@radix-ui/react-label';

export const LoginForm = () => (
  <form className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <input
        id="email"
        type="email"
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </form>
);
```

**Dashboard Card:**
```tsx
export const StatCard = ({ title, value, icon: Icon }) => (
  <div className="p-6 bg-white rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      {Icon && <Icon className="h-8 w-8 text-gray-400" />}
    </div>
  </div>
);
```

#### Best Practices

**Accessibility:**
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast

**Responsive Design:**
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Consider mobile-first approach
- Test layouts at different breakpoints

**Performance:**
- Use React.memo for expensive components
- Lazy load heavy components
- Optimize re-renders with proper key props

**Code Organization:**
- Follow your existing file structure
- Use TypeScript interfaces for all props
- Export both named and default exports
- Include JSDoc comments for complex components

#### Delivery Format

Provide users with:
1. **Analysis Summary**: "I see a [layout type] with [component list]"
2. **Generated Components**: Complete, runnable React code
3. **Usage Example**: How to import and use the component
4. **Customization Notes**: How to modify colors, sizes, variants
5. **Integration Tips**: How it fits with existing components

## Commands

- `bun run dev` - Start the dev server
- `bun run build` - Build the app for production
- `bun run preview` - Preview the production build locally

## Docs

- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
