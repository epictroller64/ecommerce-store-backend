// ts-node src/jobs/workers/fraudValidationWorker.ts
// run this file separately from the main server

import { Worker } from "bullmq"
import { validateOrder } from "../processors/fraudProcessor"
import IORedis from "ioredis"
import { FraudValidationJob } from "../../types"

const connection = new IORedis()
const worker = new Worker<FraudValidationJob>('fraudValidation', async (data) => validateOrder(data.data), { connection })

worker.on('completed', (job, result) => {
    console.log(`Fraud validation job ${job.id} completed with result: ${result}`)
})

worker.on('failed', (job, error) => {
    console.error(`Fraud validation job ${job?.id} failed with error: ${error}`)
})

worker.on('error', (error) => {
    console.error('Fraud validation worker error:', error)
})

worker.on('closed', () => {
    console.log('Fraud validation worker closed')
})