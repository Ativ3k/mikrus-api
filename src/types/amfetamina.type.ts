export interface Amfetamina {
    msg: string
    task_id: number
}

export interface AmfetaminaError {
    error: string
}


export function isAmfetaminaError(res: Amfetamina | AmfetaminaError): res is AmfetaminaError {
    return "error" in res
}
