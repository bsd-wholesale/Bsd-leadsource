import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface ValidatedLead {
  username: string
  whatsapp: string
  country: string
}

export interface JobState {
  id: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  totalLeadsTarget: number
  leadsGenerated: number
  validatedLeads: ValidatedLead[]
  logs: string[]
  createdAt: string
  completedAt?: string
  error?: string
}

const LOCAL_JOB_STORAGE_KEY = "lead_generation_job"

export async function getJobState(jobId?: string): Promise<JobState | null> {
  if (jobId) {
    // Try to get from Supabase
    const { data, error } = await supabase
      .from("lead_generation_jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (!error && data) {
      return {
        id: data.id,
        status: data.status,
        progress: data.progress,
        totalLeadsTarget: data.desired_leads,
        leadsGenerated: data.leads_generated,
        validatedLeads: data.validated_leads || [],
        logs: data.logs || [],
        createdAt: data.created_at,
        completedAt: data.completed_at,
        error: data.error,
      }
    }
  }

  // Fallback to localStorage
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(LOCAL_JOB_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setJobState(job: JobState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCAL_JOB_STORAGE_KEY, JSON.stringify(job))
}

export function clearJobState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(LOCAL_JOB_STORAGE_KEY)
}

export async function createJob(totalLeadsTarget: number): Promise<JobState> {
  const { data, error } = await supabase
    .from("lead_generation_jobs")
    .insert({
      desired_leads: totalLeadsTarget,
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
    // Fallback to local job
    const job: JobState = {
      id: Date.now().toString(),
      status: "pending",
      progress: 0,
      totalLeadsTarget,
      leadsGenerated: 0,
      validatedLeads: [],
      logs: ["Job created"],
      createdAt: new Date().toISOString(),
    }
    setJobState(job)
    return job
  }

  return {
    id: data.id,
    status: data.status,
    progress: data.progress,
    totalLeadsTarget: data.desired_leads,
    leadsGenerated: data.leads_generated,
    validatedLeads: data.validated_leads || [],
    logs: data.logs || [],
    createdAt: data.created_at,
  }
}

export async function updateJobProgress(leadsGenerated: number, validatedLead?: ValidatedLead, log?: string): Promise<void> {
  const localJob = await getJobState()
  if (!localJob) return

  let updatedValidatedLeads = localJob.validatedLeads
  if (validatedLead) {
    updatedValidatedLeads = [...updatedValidatedLeads, validatedLead]
  }

  // Update in Supabase
  const { error } = await supabase
    .from("lead_generation_jobs")
    .update({
      leads_generated: leadsGenerated,
      progress: (leadsGenerated / localJob.totalLeadsTarget) * 100,
      validated_leads: updatedValidatedLeads,
      logs: log ? [...localJob.logs, log] : localJob.logs,
    })
    .eq("id", localJob.id)

  if (error) {
    console.error("Supabase update error:", error)
  }
}

export async function setJobStatus(status: JobState["status"], error?: string): Promise<void> {
  const localJob = await getJobState()
  if (!localJob) return

  const updateData: any = {
    status,
  }

  if (status === "completed" || status === "failed") {
    updateData.completed_at = new Date().toISOString()
  }

  if (error) {
    updateData.error = error
  }

  const { error: updateError } = await supabase
    .from("lead_generation_jobs")
    .update(updateData)
    .eq("id", localJob.id)

  if (updateError) {
    console.error("Supabase status update error:", updateError)
  }
}

