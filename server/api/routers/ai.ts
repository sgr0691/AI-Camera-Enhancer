"use client"

import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const aiRouter = createTRPCRouter({
  getComponentSuggestions: publicProcedure.input(z.object({ componentId: z.string() })).query(async ({ input }) => {
    // In a real app, you would use embeddings to find relevant information
    // This is a simplified implementation for the demo

    // Mock data based on component ID
    const mockSuggestions = {
      "button-primary": {
        guidelines: [
          "Ensure buttons have sufficient contrast ratio (4.5:1)",
          "Use descriptive labels instead of generic text like 'Click Here'",
          "Maintain a minimum touch target size of 44x44 pixels",
        ],
        bestPractices: [
          "Use primary buttons for main actions, secondary for alternative actions",
          "Position primary actions on the right in action groups",
          "Limit the number of primary buttons on a single screen",
        ],
        tokens: [
          { name: "--primary", value: "#0070f3" },
          { name: "--primary-foreground", value: "#ffffff" },
          { name: "--ring", value: "#0070f3" },
        ],
        examples: [
          {
            title: "Form Submit Button",
            description: "Use a primary button for form submission",
            code: `<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <Button type="submit">Submit Form</Button>
</form>`,
          },
          {
            title: "Button with Icon",
            description: "Combine a button with an icon for visual emphasis",
            code: `<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>`,
          },
        ],
      },
      card: {
        guidelines: [
          "Ensure card content has sufficient contrast with the background",
          "Use semantic headings within cards for proper document structure",
          "Maintain consistent spacing between cards in a grid",
        ],
        bestPractices: [
          "Use cards to group related information",
          "Keep card content concise and focused",
          "Consider hover states for interactive cards",
        ],
        tokens: [
          { name: "--card", value: "#ffffff" },
          { name: "--card-foreground", value: "#111111" },
          { name: "--border", value: "#e5e5e5" },
        ],
        examples: [
          {
            title: "Product Card",
            description: "Display product information in a card layout",
            code: `<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Product description goes here</p>
    <p className="font-bold mt-2">$99.99</p>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>`,
          },
        ],
      },
    }

    // Return mock data or default values
    return (
      mockSuggestions[input.componentId as keyof typeof mockSuggestions] || {
        guidelines: ["No specific guidelines available for this component"],
        bestPractices: ["No specific best practices available for this component"],
        tokens: [],
        examples: [],
      }
    )
  }),

  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        history: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful design system assistant. Provide concise, accurate information about UI components, design tokens, accessibility, and best practices. Focus on shadcn/ui components and Tailwind CSS.",
            },
            ...input.history.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: input.message },
          ],
          max_tokens: 500,
        })

        return { response: completion.choices[0].message.content || "I'm not sure how to respond to that." }
      } catch (error) {
        console.error("OpenAI API error:", error)
        return { response: "Sorry, I encountered an error. Please try again later." }
      }
    }),
})
