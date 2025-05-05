"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

type PropertyType = "string" | "boolean" | "number" | "select"

interface PropertyOption {
  label: string
  value: string
}

interface ComponentProperty {
  name: string
  label: string
  type: PropertyType
  value: string | boolean | number
  options?: PropertyOption[]
  min?: number
  max?: number
  step?: number
}

interface Component {
  id: string
  name: string
  category: string
  component: ReactNode
  code: string
  properties: ComponentProperty[]
}

interface ComponentContextType {
  components: Component[]
  activeComponent: Component | null
  setActiveComponent: (id: string) => void
  updateComponentProperty: (name: string, value: string | boolean | number) => void
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined)

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components] = useState<Component[]>([
    {
      id: "button-primary",
      name: "Button",
      category: "Inputs",
      component: <Button>Click me</Button>,
      code: `<Button>Click me</Button>`,
      properties: [
        {
          name: "variant",
          label: "Variant",
          type: "select",
          value: "default",
          options: [
            { label: "Default", value: "default" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
            { label: "Link", value: "link" },
          ],
        },
        {
          name: "size",
          label: "Size",
          type: "select",
          value: "default",
          options: [
            { label: "Default", value: "default" },
            { label: "Small", value: "sm" },
            { label: "Large", value: "lg" },
            { label: "Icon", value: "icon" },
          ],
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
        {
          name: "text",
          label: "Text",
          type: "string",
          value: "Click me",
        },
      ],
    },
    {
      id: "card",
      name: "Card",
      category: "Layout",
      component: (
        <Card className="w-full max-w-md p-6">
          <h3 className="text-lg font-medium">Card Title</h3>
          <p className="mt-2 text-muted-foreground">This is a card component from the shadcn/ui library.</p>
        </Card>
      ),
      code: `<Card className="w-full max-w-md p-6">
  <h3 className="text-lg font-medium">Card Title</h3>
  <p className="mt-2 text-muted-foreground">This is a card component from the shadcn/ui library.</p>
</Card>`,
      properties: [
        {
          name: "title",
          label: "Title",
          type: "string",
          value: "Card Title",
        },
        {
          name: "description",
          label: "Description",
          type: "string",
          value: "This is a card component from the shadcn/ui library.",
        },
        {
          name: "padding",
          label: "Padding",
          type: "number",
          value: 6,
          min: 0,
          max: 12,
          step: 1,
        },
      ],
    },
    {
      id: "checkbox",
      name: "Checkbox",
      category: "Inputs",
      component: <Checkbox />,
      code: `<Checkbox />`,
      properties: [
        {
          name: "checked",
          label: "Checked",
          type: "boolean",
          value: false,
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
      ],
    },
    {
      id: "input",
      name: "Input",
      category: "Inputs",
      component: <Input placeholder="Enter text..." />,
      code: `<Input placeholder="Enter text..." />`,
      properties: [
        {
          name: "placeholder",
          label: "Placeholder",
          type: "string",
          value: "Enter text...",
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          value: "text",
          options: [
            { label: "Text", value: "text" },
            { label: "Password", value: "password" },
            { label: "Email", value: "email" },
            { label: "Number", value: "number" },
          ],
        },
      ],
    },
    {
      id: "select",
      name: "Select",
      category: "Inputs",
      component: <div className="w-full max-w-xs">Select Component (Interactive in preview)</div>,
      code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,
      properties: [
        {
          name: "placeholder",
          label: "Placeholder",
          type: "string",
          value: "Select an option",
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
      ],
    },
    {
      id: "slider",
      name: "Slider",
      category: "Inputs",
      component: <Slider defaultValue={[50]} max={100} step={1} className="w-full max-w-xs" />,
      code: `<Slider defaultValue={[50]} max={100} step={1} />`,
      properties: [
        {
          name: "defaultValue",
          label: "Default Value",
          type: "number",
          value: 50,
          min: 0,
          max: 100,
          step: 1,
        },
        {
          name: "step",
          label: "Step",
          type: "number",
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
      ],
    },
    {
      id: "switch",
      name: "Switch",
      category: "Inputs",
      component: <Switch />,
      code: `<Switch />`,
      properties: [
        {
          name: "checked",
          label: "Checked",
          type: "boolean",
          value: false,
        },
        {
          name: "disabled",
          label: "Disabled",
          type: "boolean",
          value: false,
        },
      ],
    },
    {
      id: "tabs",
      name: "Tabs",
      category: "Navigation",
      component: <div className="w-full max-w-md">Tabs Component (Interactive in preview)</div>,
      code: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Tab 1 content</TabsContent>
  <TabsContent value="tab2">Tab 2 content</TabsContent>
  <TabsContent value="tab3">Tab 3 content</TabsContent>
</Tabs>`,
      properties: [
        {
          name: "defaultTab",
          label: "Default Tab",
          type: "select",
          value: "tab1",
          options: [
            { label: "Tab 1", value: "tab1" },
            { label: "Tab 2", value: "tab2" },
            { label: "Tab 3", value: "tab3" },
          ],
        },
      ],
    },
  ])

  const [activeComponentId, setActiveComponentId] = useState<string | null>(null)

  const activeComponent = activeComponentId ? components.find((c) => c.id === activeComponentId) || null : null

  const setActiveComponent = (id: string) => {
    setActiveComponentId(id)
  }

  const updateComponentProperty = (name: string, value: string | boolean | number) => {
    if (!activeComponent) return

    // This is a simplified implementation for the demo
    // In a real app, you would need to update the component and code based on the property changes
    console.log(`Updating property ${name} to ${value}`)
  }

  return (
    <ComponentContext.Provider
      value={{
        components,
        activeComponent,
        setActiveComponent,
        updateComponentProperty,
      }}
    >
      {children}
    </ComponentContext.Provider>
  )
}

export function useComponent() {
  const context = useContext(ComponentContext)
  if (context === undefined) {
    throw new Error("useComponent must be used within a ComponentProvider")
  }
  return context
}
