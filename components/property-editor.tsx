"use client"

import { useComponent } from "@/context/component-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function PropertyEditor() {
  const { activeComponent, updateComponentProperty } = useComponent()

  if (!activeComponent) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeComponent.properties.map((property) => (
            <div key={property.name} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={property.name} className="text-right">
                {property.label}
              </Label>
              {property.type === "string" && (
                <Input
                  id={property.name}
                  value={property.value as string}
                  onChange={(e) => updateComponentProperty(property.name, e.target.value)}
                  className="col-span-2"
                />
              )}
              {property.type === "boolean" && (
                <div className="col-span-2 flex items-center">
                  <Switch
                    id={property.name}
                    checked={property.value as boolean}
                    onCheckedChange={(checked) => updateComponentProperty(property.name, checked)}
                  />
                </div>
              )}
              {property.type === "select" && (
                <Select
                  value={property.value as string}
                  onValueChange={(value) => updateComponentProperty(property.name, value)}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {property.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {property.type === "number" && (
                <div className="col-span-2 flex items-center gap-2">
                  <Slider
                    id={property.name}
                    min={property.min || 0}
                    max={property.max || 100}
                    step={property.step || 1}
                    value={[property.value as number]}
                    onValueChange={([value]) => updateComponentProperty(property.name, value)}
                  />
                  <span className="w-12 text-right text-sm">{property.value}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
