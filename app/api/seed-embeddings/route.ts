import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { OpenAI } from "openai"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// This is a simplified implementation for the demo
// In a real app, you would have more comprehensive data
const designSystemData = [
  {
    content:
      "Buttons should have sufficient contrast ratio (4.5:1) for accessibility. Use descriptive labels instead of generic text like 'Click Here'.",
    category: "button",
  },
  {
    content:
      "Cards group related information and should maintain consistent spacing in a grid layout. Keep card content concise and focused.",
    category: "card",
  },
  {
    content:
      "Inputs should have clear labels and validation states. Provide helpful error messages when validation fails.",
    category: "input",
  },
]

export async function GET() {
  try {
    // Check if we already have embeddings
    const result = await executeQuery('SELECT COUNT(*) as "count" FROM "Embedding"')
    const existingCount = result[0].count

    if (existingCount > 0) {
      return NextResponse.json({ message: "Embeddings already exist" })
    }

    // Generate embeddings for each piece of content
    for (const item of designSystemData) {
      try {
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: item.content,
        })

        await executeQuery(
          'INSERT INTO "Embedding" (id, content, vector, category, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
          [
            `emb_${Math.random().toString(36).substring(2, 15)}`,
            item.content,
            embedding.data[0].embedding,
            item.category,
            new Date(),
            new Date(),
          ],
        )
      } catch (embeddingError) {
        console.error("Error creating embedding:", embeddingError)
      }
    }

    return NextResponse.json({ message: "Embeddings created successfully" })
  } catch (error) {
    console.error("Error seeding embeddings:", error)
    return NextResponse.json({ error: "Failed to seed embeddings" }, { status: 500 })
  }
}
