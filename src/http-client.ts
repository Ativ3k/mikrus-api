export interface HttpClientOptions {
    apiKey: string
    server: string
    baseUrl: string
}

export class HttpClient {
    private readonly apiKey: string
    private readonly server: string
    private readonly baseUrl: string

    constructor(options: HttpClientOptions) {
        this.apiKey = options.apiKey
        this.server = options.server
        this.baseUrl = options.baseUrl
    }

    private buildForm(body: Record<string, unknown> = {}): URLSearchParams {
        const form = new URLSearchParams()
        form.set("key", this.apiKey)
        form.set("srv", this.server)
        for (const [k, v] of Object.entries(body)) {
            form.set(k, String(v))
        }
        return form
    }

    private async request(path: string, body: Record<string, unknown> = {}): Promise<Response> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: this.buildForm(body).toString()
        })
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${path}`)
        return res
    }

    public async post<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
        const res = await this.request(path, body)
        return res.json() as Promise<T>
    }

    public async postBash(path: `${string}.bash`, body: Record<string, unknown> = {}): Promise<string> {
        const res = await this.request(path, body)
        return res.text()
    }
}


