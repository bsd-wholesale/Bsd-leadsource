import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

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

    // Get the path to the Python script
    // The dashboard is in a subdirectory, so we need to go up to the parent
    const scriptPath = path.resolve(process.cwd(), "..", "scripts", "run_real_instagram_cycle.py")
    const cwd = path.resolve(process.cwd(), "..")
    
    console.log("Script path:", scriptPath)
    console.log("Working directory:", cwd)
    
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

    return NextResponse.json({
      success: true,
      message: "Instagram cycle started",
      jobId: Date.now().toString()
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to start Instagram cycle" },
      { status: 500 }
    )
  }
}
