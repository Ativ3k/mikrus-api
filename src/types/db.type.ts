export enum DbTypeEnum {
    PSQL = 'psql',
    MONGO = 'mongo',
    MYSQL = 'mysql'
}

export type DbType = `${DbTypeEnum}`

export interface RawDb extends Record<DbType, string> { }

export interface RawDbError {
    error: string
}

export type RawDbResponse = RawDb | RawDbError;

export interface DbCredentials {
    host: string
    login: string
    password: string
    database: string
}

export interface MongoCredentials extends DbCredentials {
    port: number
}

export interface Db {
    psql: DbCredentials
    mysql: DbCredentials
    mongo: MongoCredentials
}

function parseLines(raw: string): (prefix: string) => string {
    const lines = raw.split("\n").filter(Boolean)
    return (prefix: string) =>
        lines.find(l => l.startsWith(prefix))?.split(": ")[1] ?? ""
}

function parsePsqlCredentials(raw: string): DbCredentials {
    const get = parseLines(raw)
    return {
        host: get("Server"),
        login: get("login"),
        password: get("Haslo"),
        database: get("Baza"),
    }
}

function parseMongoCredentials(raw: string): MongoCredentials {
    const get = parseLines(raw)
    return {
        host: get("Host"),
        login: get("Login"),
        password: get("Haslo"),
        database: get("Baza"),
        port: parseInt(get("Port"), 10),
    }
}

export function parseDb(raw: RawDb): Db {
    return {
        psql: parsePsqlCredentials(raw.psql),
        mysql: parsePsqlCredentials(raw.mysql),
        mongo: parseMongoCredentials(raw.mongo),
    }
}
