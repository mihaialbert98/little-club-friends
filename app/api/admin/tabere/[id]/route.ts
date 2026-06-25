import { makeEventItemHandlers } from '@/lib/event-handlers'
import { EVENT_CONFIG } from '@/lib/events'

export const { PUT, DELETE } = makeEventItemHandlers(EVENT_CONFIG.camps)
