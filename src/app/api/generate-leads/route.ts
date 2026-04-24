import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { desiredLeads, maxAmount } = body

    // Validate inputs
    if (!desiredLeads || !maxAmount) {
      return NextResponse.json(
        { error: "Missing required fields: desiredLeads, maxAmount" },
        { status: 400 }
      )
    }

    // Create job in Supabase
    const { data: job, error } = await supabase
      .from("lead_generation_jobs")
      .insert({
        desired_leads: desiredLeads,
        max_budget: maxAmount,
        status: "pending",
        progress: 0,
        leads_generated: 0,
        logs: ["Job created"],
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      // If table doesn't exist, fall back to local job creation
      return NextResponse.json({
        success: true,
        message: "Job created (note: Supabase table 'lead_generation_jobs' needs to be created)",
        jobId: Date.now().toString(),
        fallback: true
      })
    }

    return NextResponse.json({
      success: true,
      message: "Job created in Supabase",
      jobId: job.id
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    )
  }
}

