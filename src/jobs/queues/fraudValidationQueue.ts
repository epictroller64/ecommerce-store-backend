import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { FraudValidationJob } from '../../types'

const connection = new IORedis()
export const fraudValidationQueue = new Queue<FraudValidationJob>('fraudValidation', { connection })
