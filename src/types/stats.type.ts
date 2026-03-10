// src/types/stats.type.ts

export interface StatsRaw {
    free: string
    df: string
    uptime: string
    ps: string
}

export interface StatsMemory {
    total: number
    used: number
    free: number
    shared: number
    buffCache: number
    available: number
}

export interface StatsDisk {
    filesystem: string
    size: string
    used: string
    available: string
    usePercent: number
    mountedOn: string
}

export interface Stats {
    memory: StatsMemory
    disks: StatsDisk[]
    uptime: string
    ps: string
}

function parseMemoryLine(line: string): StatsMemory {
    const parts = line.trim().split(/\s+/)
    return {
        total: parseInt(parts[1], 10),
        used: parseInt(parts[2], 10),
        free: parseInt(parts[3], 10),
        shared: parseInt(parts[4], 10),
        buffCache: parseInt(parts[5], 10),
        available: parseInt(parts[6], 10),
    }
}

function parseDiskLine(line: string): StatsDisk {
    const parts = line.trim().split(/\s+/)
    return {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        available: parts[3],
        usePercent: parseInt(parts[4], 10),
        mountedOn: parts[5],
    }
}

export function parseStats(raw: StatsRaw): Stats {
    const freeLines = raw.free.split("\n").filter(Boolean)
    const memLine = freeLines.find(l => l.startsWith("Mem:")) ?? ""

    const dfLines = raw.df.split("\n").filter(Boolean)
    const disks = dfLines.slice(1).map(parseDiskLine)

    return {
        memory: parseMemoryLine(memLine),
        disks,
        uptime: raw.uptime.trim(),
        ps: raw.ps.trim(),
    }
}
