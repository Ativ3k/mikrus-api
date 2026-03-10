// src/types/log.type.ts

export interface RawLog {
    id: string
    server_id: string
    task: string
    when_created: string
    when_done: string
    output: string
}

export interface Log {
    id: number
    serverId: string
    task: string
    whenCreated: Date
    whenDone: Date
    output: string
}

export function parseLog(raw: RawLog): Log {
    return {
        id: parseInt(raw.id, 10),
        serverId: raw.server_id,
        task: raw.task,
        whenCreated: new Date(raw.when_created.replace(" ", "T") + "Z"),
        whenDone: new Date(raw.when_done.replace(" ", "T") + "Z"),
        output: raw.output,
    }
}
