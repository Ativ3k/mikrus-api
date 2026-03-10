export interface Amfetamina {
    msg: string
    task_id: number
}

export interface AmfetaminaError {
    error: string
}

export type AmfetaminaResponse = Amfetamina | AmfetaminaError
