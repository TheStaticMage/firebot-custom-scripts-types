export type EventSource = {
    id: string;
    name: string;
    events: Array<{
        id: string;
        name: string;
        description: string;
        cached?: boolean;
        cacheMetaKey?: string;
        manualMetadata?: Record<string, unknown>;
        activityFeed?: {
            icon: string;
            getMessage: (eventData: Record<string, unknown>) => string;
        };
    }>;
};

export type EventManager = {
    registerEventSource: (eventSource: EventSource) => void;
    triggerEvent: (
        sourceId: string,
        eventId: string,
        meta: Record<string, unknown>,
        isManual?: boolean
    ) => void;
};
