import { makeEventCollectionHandlers } from '@/lib/event-handlers'
import { EVENT_CONFIG } from '@/lib/events'

export const { GET, POST } = makeEventCollectionHandlers(EVENT_CONFIG.camps)
