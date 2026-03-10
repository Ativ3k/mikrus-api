export interface Domain {
    name: string
}

export interface DomainNew {
    status: string;
    domain?: string
    port?: string
}

export interface DomainNewError {
    error: string;
}


export type DomainResponse = DomainNew | DomainNewError | [Domain]
