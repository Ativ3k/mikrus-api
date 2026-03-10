import { HttpClient } from "./http-client"
import { Amfetamina, AmfetaminaError } from "./types/amfetamina.type"
import { Db, DbCredentials, DbType, MongoCredentials, parseDb, RawDb, RawDbError } from "./types/db.type"
import { Exec } from "./types/exec.type"
import { parseServerInfo, RawServerInfo, ServerInfo } from "./types/info.type"
import { Log, parseLog, RawLog } from "./types/logs.type"
import { Restart, RestartError } from "./types/restart.type"
import { parseSerwer, RawSerwer, Serwer } from "./types/serwery.type"
import { parseStats, Stats, StatsRaw } from "./types/stats.type"

export class MikrusClient {
    private readonly http: HttpClient

    constructor(apiKey: string, srv: string) {
        this.http = new HttpClient({
            apiKey,
            server: srv,
            baseUrl: "https://api.mikr.us"
        })
    }

    // -------------- INFO --------------
    async info(): Promise<ServerInfo> {
        const raw = await this.http.post<RawServerInfo>("/info")
        return parseServerInfo(raw)
    }

    async infoRaw(): Promise<RawServerInfo> {
        return this.http.post<RawServerInfo>("/info")
    }

    async infoBash(): Promise<string> {
        return this.http.postBash("/info.bash")
    }

    // -------------- SERWERY --------------
    async serwery(): Promise<Serwer[]> {
        const raw = await this.http.post<RawSerwer[]>('/serwery')
        return raw.map(parseSerwer)
    }

    async serweryRaw(): Promise<RawSerwer[]> {
        return this.http.post<RawSerwer[]>('/serwery')
    }

    async serweryBash(): Promise<string> {
        return this.http.postBash("/serwery.bash")
    }

    // -------------- RESTART --------------
    async restart(): Promise<Restart> {
        const res = await this.http.post<Restart | RestartError>('/restart')
        if ("error" in res) throw new Error(res.error)
        return res;
    }

    // -------------- LOGS --------------

    async logs(): Promise<Log[]> {
        const raw = await this.http.post<RawLog[]>("/logs")
        return raw.map(parseLog)
    }

    async logsRaw(): Promise<RawLog[]> {
        return this.http.post<RawLog[]>("/logs")
    }

    async logsBash(): Promise<string> {
        return this.http.postBash('/logs.bash')
    }

    async logsById(id: number | string): Promise<Log> {
        const raw = await this.http.post<RawLog>(`/logs/${id}`)
        return parseLog(raw)
    }

    async logsByIdRaw(id: number | string): Promise<RawLog> {
        return this.http.post<RawLog>(`/logs/${id}`)
    }

    // -------------- AMFETAMINA --------------

    async amfetamina(): Promise<Amfetamina> {
        const res = await this.http.post<Amfetamina | AmfetaminaError>("/amfetamina")
        if ("error" in res) throw new Error(res.error)
        return res;
    }

    async amfetaminaBash(): Promise<string> {
        const res = await this.http.postBash("/amfetamina.bash")
        if (res.startsWith('error')) throw new Error(res.split('=')[1])
        return res;
    }

    // -------------- DB --------------

    async db(): Promise<Db> {
        const res = await this.http.post<RawDb | RawDbError>("/db")
        if ("error" in res) throw new Error(res.error)
        return parseDb(res)
    }

    async dbByType(type: DbType): Promise<MongoCredentials | DbCredentials> {
        const res = await this.http.post<RawDb | RawDbError>("/db")
        if ("error" in res) throw new Error(res.error)
        return parseDb(res)[type]
    }

    async dbByTypeRaw(type: DbType): Promise<string> {
        const res = await this.http.post<RawDb | RawDbError>("/db")
        if ("error" in res) throw new Error(res.error)
        return res[type];
    }

    async dbRaw(): Promise<RawDb> {
        const res = await this.http.post<RawDb | RawDbError>("/db")
        if ("error" in res) throw new Error(res.error)
        return res;
    }

    async dbBash(): Promise<string> {
        return this.http.postBash("/db.bash")
    }

    // -------------- EXEC --------------

    async exec(cmd: string): Promise<Exec> {
        return this.http.post<Exec>("/exec", { cmd })
    }

    // -------------- STATS --------------

    async stats(): Promise<Stats> {
        const res = await this.http.post<StatsRaw>("/stats")
        return parseStats(res)
    }

    async statsRaw(): Promise<StatsRaw> {
        return this.http.post<StatsRaw>("/stats")
    }

    // -------------- PORTY --------------

    async porty(): Promise<number[]> {
        return this.http.post<number[]>("/porty")
    }

    async portyBash(): Promise<string> {
        return this.http.postBash("/porty.bash")
    }

}
