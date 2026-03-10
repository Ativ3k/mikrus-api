export interface RawServerInfo {
    server_id: string
    imie_id: string
    server_name: string | null
    expires: string
    expires_storage: string
    param_ram: string
    param_disk: string
    lastlog_panel: string
    mikrus_pro: string
}

export interface ServerInfo {
    serverId: string
    imieId: string
    serverName: string | null
    expires: Date
    expiresStorage: Date
    paramRam: number
    paramDisk: number
    lastlogPanel: Date
    mikrusPro: boolean
}

export function parseServerInfo(raw: RawServerInfo): ServerInfo {
    return {
        serverId: raw.server_id,
        imieId: raw.imie_id,
        serverName: raw.server_name,
        expires: new Date(raw.expires.replace(" ", "T") + "Z"),
        expiresStorage: new Date(raw.expires_storage.replace(" ", "T") + "Z"),
        paramRam: parseInt(raw.param_ram, 10),
        paramDisk: parseInt(raw.param_disk, 10),
        lastlogPanel: new Date(raw.lastlog_panel.replace(" ", "T") + "Z"),
        mikrusPro: raw.mikrus_pro === "tak",
    }
}
