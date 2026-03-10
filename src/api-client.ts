import { HttpClient } from "./http-client"
import { Amfetamina, AmfetaminaError, isAmfetaminaError } from "./types/amfetamina.type"
import { parseServerInfo, RawServerInfo, ServerInfo } from "./types/info.type"
import { Log, parseLog, RawLog } from "./types/logs.type"
import { parseSerwer, RawSerwer, Serwer } from "./types/serwery.type"

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
    // todo

    // -------------- LOGS --------------

    async logs(): Promise<Log[]> {
        const raw = await this.http.post<RawLog[]>("/logs")
        return raw.map(parseLog)
    }

    async logsRaw(): Promise<RawLog[]> {
        return this.http.post<RawLog[]>("/logs")
    }

    async logsBash() {
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

    async amfetamina() {
        const res = await this.http.post<Amfetamina | AmfetaminaError>("/amfetamina")
        if (isAmfetaminaError(res)) throw new Error(res.error)
        return res;
    }

    async amfetaminaBash() {
        const res = await this.http.postBash("/amfetamina.bash")
        if (res.startsWith('error')) throw new Error(res.split('=')[1])
        return res;
    }
}
