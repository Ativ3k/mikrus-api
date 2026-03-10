export interface RawSerwer {
    server_id: string
    server_name: string | null
    expires: string
    param_ram: string
    param_disk: string
}

export interface Serwer {
    serverId: string
    serverName: string | null
    expires: Date
    paramRam: number
    paramDisk: number
}

export function parseSerwer(raw: RawSerwer): Serwer {
    return {
        serverId: raw.server_id,
        serverName: raw.server_name,
        expires: new Date(raw.expires.replace(" ", "T") + "Z"),
        paramRam: parseInt(raw.param_ram, 10),
        paramDisk: parseInt(raw.param_disk, 10),
    }
}
