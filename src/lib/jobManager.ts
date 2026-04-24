export interface JobState {
  id: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  totalLeadsTarget: number
  leadsGenerated: number
  logs: string[]
  createdAt: string
  completedAt?: string
  error?: string
}

const JOB_STORAGE_KEY = "lead_generation_job"

export function getJobState(): JobState | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(JOB_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setJobState(job: JobState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(job))
}

export function clearJobState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(JOB_STORAGE_KEY)
}

export function createJob(totalLeadsTarget: number): JobState {
  const job: JobState = {
    id: Date.now().toString(),
    status: "pending",
    progress: 0,
    totalLeadsTarget,
    leadsGenerated: 0,
    logs: ["Job created"],
    createdAt: new Date().toISOString(),
  }
  setJobState(job)
  return job
}

export function updateJobProgress(leadsGenerated: number, log?: string): void {
  const job = getJobState()
  if (!job) return

  job.leadsGenerated = leadsGenerated
  job.progress = (leadsGenerated / job.totalLeadsTarget) * 100
  if (log) {
    job.logs.push(log)
  }
  setJobState(job)
}

export function setJobStatus(status: JobState["status"], error?: string): void {
  const job = getJobState()
  if (!job) return

  job.status = status
  if (status === "completed" || status === "failed") {
    job.completedAt = new Date().toISOString()
  }
  if (error) {
    job.error = error
  }
  setJobState(job)
}
