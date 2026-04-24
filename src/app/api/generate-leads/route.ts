import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { spawn } from "child_process"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Check if running in local development
const isLocal = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV !== "production"

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

    if (isLocal) {
      // Local development: Spawn Python process directly
      return handleLocalExecution(desiredLeads, maxAmount)
    } else {
      // Railway/Production: Use Supabase job queue
      return handleSupabaseJob(desiredLeads, maxAmount)
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to start Instagram cycle" },
      { status: 500 }
    )
  }
}

async function handleLocalExecution(desiredLeads: number, maxAmount: number): Promise<NextResponse> {
  try {
    // Get the path to the Python script
    const scriptPath = path.resolve(process.cwd(), "..", "scripts", "run_real_instagram_cycle.py")
    const cwd = path.resolve(process.cwd(), "..")
    
    console.log("Local execution - Script path:", scriptPath)
    console.log("Working directory:", cwd)
    console.log("Starting real Instagram cycle via Apify...")
    
    // Spawn Python process (non-blocking)
    const pythonProcess = spawn("python3", [scriptPath], {
      cwd: cwd,
      detached: true,
      stdio: "ignore"
    })

    // Detach the process so it continues running even if the parent exits
    pythonProcess.unref()

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error)
    })

    pythonProcess.on("exit", (code, signal) => {
      console.log(`Python process exited with code ${code} and signal ${signal}`)
    })

    console.log("Instagram cycle started successfully via Apify")

    return NextResponse.json({
      success: true,
      message: "Instagram cycle started (real Apify execution - auto-inserting to Supabase)",
      jobId: Date.now().toString(),
      method: "local",
      apify: true
    })
  } catch (error) {
    console.error("Local execution error:", error)
    // Fallback to Supabase if local execution fails
    return handleSupabaseJob(desiredLeads, maxAmount)
  }
}

async function handleSupabaseJob(desiredLeads: number, maxAmount: number): Promise<NextResponse> {
  if (!supabase) {
    // Supabase not configured, fall back to local execution
    console.log("Supabase not configured, falling back to local execution")
    return handleLocalExecution(desiredLeads, maxAmount)
  }

  try {
    // Create job in Supabase
    const { data: job, error } = await supabase
      .from("lead_generation_jobs")
      .insert({
        desired_leads: desiredLeads,
        max_budget: maxAmount,
        status: "pending",
        progress: 0,
        leads_generated: 0,
        validated_leads: [],
        logs: ["Job created"],
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      // Fall back to local execution if Supabase fails
      return handleLocalExecution(desiredLeads, maxAmount)
    }

    return NextResponse.json({
      success: true,
      message: "Job created in Supabase",
      jobId: job.id,
      method: "supabase"
    })
  } catch (error) {
    console.error("Supabase job creation error:", error)
    // Fall back to local execution
    return handleLocalExecution(desiredLeads, maxAmount)
  }
}
