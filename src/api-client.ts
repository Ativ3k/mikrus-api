import { MikrusEndpoints } from "./enums/endpoints.enum"
import { HttpClient } from "./http-client"
import { Amfetamina, AmfetaminaResponse } from "./types/amfetamina.type"
import { Db, DbCredentials, DbType, MongoCredentials, parseDb, RawDb, RawDbResponse } from "./types/db.type"
import { Domain, DomainNew, DomainResponse } from "./types/domain.type"
import { Exec } from "./types/exec.type"
import { parseServerInfo, RawServerInfo, ServerInfo } from "./types/info.type"
import { Log, parseLog, RawLog } from "./types/logs.type"
import { Restart, RestartResponse } from "./types/restart.type"
import { parseSerwer, RawSerwer, Serwer } from "./types/serwery.type"
import { parseStats, Stats, StatsRaw } from "./types/stats.type"

export class MikrusClient {
    private readonly http: HttpClient


    /**
     * @param apiKey - API key from https://mikr.us/panel/?a=api
     * @param srv - Server ID (e.g. "adam123")
     */
    constructor(apiKey: string, srv: string) {
        this.http = new HttpClient({
            apiKey,
            server: srv,
            baseUrl: "https://api.mikr.us"
        })
    }

    // -------------- INFO --------------

    /** Returns server information (RAM, disk, expiry dates etc.). 
    * @cache 60s
    */
    async info(): Promise<ServerInfo> {
        const raw = await this.http.post<RawServerInfo>(MikrusEndpoints.INFO)
        return parseServerInfo(raw)
    }

    /** Returns raw server information without parsing. 
    * @cache 60s
    */
    async infoRaw(): Promise<RawServerInfo> {
        return this.http.post<RawServerInfo>(MikrusEndpoints.INFO)
    }

    /** Returns server information as bash environment variables. 
    * @cache 60s
    */
    async infoBash(): Promise<string> {
        return this.http.postBash(`${MikrusEndpoints.INFO}.bash`)
    }

    // -------------- SERWERY --------------

    /** Returns all servers assigned to the account. 
    * @cache 60s
    */
    async serwery(): Promise<Serwer[]> {
        const raw = await this.http.post<RawSerwer[]>(MikrusEndpoints.SERWERY)
        return raw.map(parseSerwer)
    }

    /** Returns raw server list without parsing. 
    * @cache 60s
    */
    async serweryRaw(): Promise<RawSerwer[]> {
        return this.http.post<RawSerwer[]>(MikrusEndpoints.SERWERY)
    }

    /** Returns server list as bash environment variables. 
    * @cache 60s
    */
    async serweryBash(): Promise<string> {
        return this.http.postBash(`${MikrusEndpoints.SERWERY}.bash`)
    }

    // -------------- RESTART --------------

    /**
    * Restarts the server.
    * @throws {Error} If the restart is unavailable
    */
    async restart(): Promise<Restart> {
        const res = await this.http.post<RestartResponse>(MikrusEndpoints.RESTART)
        if ("error" in res) throw new Error(res.error)
        return res;
    }

    // -------------- LOGS --------------

    /** Returns the last 10 task log entries (reinstall, marian etc.). */
    async logs(): Promise<Log[]> {
        const raw = await this.http.post<RawLog[]>(MikrusEndpoints.LOGS)
        return raw.map(parseLog)
    }

    /** Returns raw logs without parsing. */
    async logsRaw(): Promise<RawLog[]> {
        return this.http.post<RawLog[]>(MikrusEndpoints.LOGS)
    }

    /** Returns logs as bash environment variables. */
    async logsBash(): Promise<string> {
        return this.http.postBash(`${MikrusEndpoints.LOGS}.bash`)
    }

    /**
     * Returns a specific log entry by ID.
     * @param id - Log entry ID from the logs list
     */
    async logsById(id: number | string): Promise<Log> {
        const raw = await this.http.post<RawLog>(`${MikrusEndpoints.LOGS}/${id}`)
        return parseLog(raw)
    }

    /**
     * Returns a specific raw log entry by ID without parsing.
     * @param id - Log entry ID from the logs list
     */
    async logsByIdRaw(id: number | string): Promise<RawLog> {
        return this.http.post<RawLog>(`${MikrusEndpoints.LOGS}/${id}`)
    }

    // -------------- AMFETAMINA --------------

    /**
    * Activates amfetamina — a temporary server performance boost.
    * @throws {Error} If the cooldown has not passed
    */
    async amfetamina(): Promise<Amfetamina> {
        const res = await this.http.post<AmfetaminaResponse>(MikrusEndpoints.AMFETAMINA)
        if ("error" in res) throw new Error(res.error)
        return res;
    }

    /**
    * Activates amfetamina — a temporary server performance boost.
    * @throws {Error} If the cooldown has not passed
    */
    async amfetaminaBash(): Promise<string> {
        const res = await this.http.postBash(`${MikrusEndpoints.AMFETAMINA}.bash`)
        if (res.startsWith('error')) throw new Error(res.split('=')[1])
        return res;
    }

    // -------------- DB --------------

    /**
     * Returns access credentials for all databases (psql, mysql, mongo).
     * @returns Parsed credentials for all available database types
     * @throws {Error} If the server has no databases assigned
     * @cache 60s
     */
    async db(): Promise<Db> {
        return parseDb(await this.fetchDb())
    }

    /**
     * Returns access credentials for a specific database type.
     * @param type - Database type: "psql" | "mysql" | "mongo"
     * @returns Parsed credentials for the specified database type
     * @throws {Error} If the server has no databases assigned
     * @cache 60s
     */
    async dbByType(type: DbType): Promise<MongoCredentials | DbCredentials> {
        return parseDb(await this.fetchDb())[type]
    }

    /**
     * Returns raw unparsed credentials string for a specific database type.
     * @param type - Database type: "psql" | "mysql" | "mongo"
     * @returns Raw multiline string with credentials as returned by the API
     * @throws {Error} If the server has no databases assigned
     * @cache 60s
     */
    async dbByTypeRaw(type: DbType): Promise<string> {
        return (await this.fetchDb())[type]
    }

    /**
     * Returns raw database credentials without parsing.
     * @returns Raw API response with unparsed credential strings per database type
     * @throws {Error} If the server has no databases assigned
     * @cache 60s
     */
    async dbRaw(): Promise<RawDb> {
        return this.fetchDb()
    }

    /**
     * Returns database credentials as bash environment variables.
     * @returns Bash-formatted string with exported credential variables
     * @cache 60s
     */
    async dbBash(): Promise<string> {
        return this.http.postBash(`${MikrusEndpoints.DB}.bash`)
    }

    // -------------- EXEC --------------

    /**
    * Executes a command on the server.
    * @param cmd - Command to execute (e.g. "df -h", "systemctl restart nginx")
    * @throws {Error} If the command exceeds the 60s timeout
    */
    async exec(cmd: string): Promise<Exec> {
        return this.http.post<Exec>(MikrusEndpoints.EXEC, { cmd })
    }

    // -------------- STATS --------------

    /** Returns server statistics: disk usage, memory, uptime and process list. 
    * @cache 60s
    */
    async stats(): Promise<Stats> {
        const res = await this.http.post<StatsRaw>(MikrusEndpoints.STATS)
        return parseStats(res)
    }

    /** Returns raw server statistics without parsing. 
    * @cache 60s
    */
    async statsRaw(): Promise<StatsRaw> {
        return this.http.post<StatsRaw>(MikrusEndpoints.STATS)
    }

    // -------------- PORTY --------------

    /** Returns a list of assigned TCP/UDP ports. 
    * @cache 60s
    */
    async porty(): Promise<number[]> {
        return this.http.post<number[]>(MikrusEndpoints.PORTY)
    }

    /** Returns assigned ports as bash environment variables. 
    * @cache 60s
    */
    async portyBash(): Promise<string> {
        return this.http.postBash(`${MikrusEndpoints.PORTY}.bash`)
    }

    // -------------- CLOUD --------------

    // TODO


    // -------------- DOMAIN --------------

    /** Returns a list of domains assigned to the server. */
    async domain(): Promise<Domain[]> {
        return this.http.post(MikrusEndpoints.DOMAIN)
    }

    /**
     * Assigns a domain to a port.
     * @param port - Server port (e.g. 3000)
     * @param domain - Full domain name (e.g. mydomain.tojest.dev) or "-" to auto-assign. Default: "-"
     * @throws {Error} If the domain name is invalid
     */
    async domainNew(port: number, domain = '-'): Promise<DomainNew> {
        const res = await this.http.post<DomainResponse>(MikrusEndpoints.DOMAIN, { port, domain })
        if ("error" in res) throw new Error(res.error)
        if (Array.isArray(res)) throw new Error(`Unexpected array response from ${MikrusEndpoints.DOMAIN}`)
        return res
    }

    // -------------- PRIVATE --------------

    private async fetchDb(): Promise<RawDb> {
        const res = await this.http.post<RawDbResponse>(MikrusEndpoints.DB)
        if ("error" in res) throw new Error(res.error)
        return res
    }

}
