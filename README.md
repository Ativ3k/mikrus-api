# mikrus-api

A lightweight TypeScript/JavaScript API wrapper for [mikr.us](https://mikr.us).

## Installation

```bash
npm install mikrus-api
# or
yarn add mikrus-api
# or
pnpm add mikrus-api
# or
bun add mikrus-api
```

## Requirements

- Node.js >= 20

## Usage

```ts
import { MikrusClient } from 'mikrus-api';

const client = new MikrusClient('YOUR_API_KEY', 'YOUR_SERVER_ID');
```

> Get your API key at: https://mikr.us/panel/?a=api

## Available Methods

### Info

```ts
await client.info(); // Parsed server info (RAM, disk, expiry dates, etc.)
await client.infoRaw(); // Raw API response
await client.infoBash(); // Bash environment variables format
```

### Servers

```ts
await client.serwery(); // List of all servers on the account
await client.serweryRaw(); // Raw API response
await client.serweryBash(); // Bash format
```

### Restart

```ts
await client.restart(); // Restart the server (throws if unavailable)
```

### Logs

```ts
await client.logs(); // Last 10 task log entries
await client.logsRaw(); // Raw log entries
await client.logsBash(); // Bash format
await client.logsById(id); // Single log entry by ID
await client.logsByIdRaw(id); // Single raw log entry by ID
```

### Amfetamina (Performance Boost)

```ts
await client.amfetamina(); // Activate temporary performance boost (throws on cooldown)
await client.amfetaminaBash(); // Bash format
```

### Databases

```ts
await client.db(); // All DB credentials (psql, mysql, mongo)
await client.dbByType('psql'); // Credentials for a specific DB type
await client.dbByTypeRaw('mysql'); // Raw credentials string for a specific DB type
await client.dbRaw(); // Raw API response
await client.dbBash(); // Bash format
```

Supported types: `"psql"` | `"mysql"` | `"mongo"`

### Exec

```ts
await client.exec('df -h'); // Execute a command on the server (60s timeout)
```

### Stats

```ts
await client.stats(); // Server stats: disk, memory, uptime, process list
await client.statsRaw(); // Raw API response
```

### Ports

```ts
await client.porty(); // List of assigned TCP/UDP ports
await client.portyBash(); // Bash format
```

### Domains

```ts
await client.domain(); // List of domains assigned to the server
await client.domainNew(3000); // Auto-assign a domain to port 3000
await client.domainNew(3000, 'mydomain.tojest.dev'); // Assign a specific domain to a port
```

## Build

Required [bun](https://bun.com/).

```bash
bun run build
```

## License

[MIT](https://github.com/Ativ3k/mikrus-api/blob/master/LICENSE)
