export type EvaluationRequest = {
    context: {
        user_id: string;
        targetingKey?: string;
        [key: string]: unknown;
    };
}

export type EvaluationResponse = {
    key: string;
    reason: string;
    variant: string;
    metaData: { type: string };
    value: unknown;
}


type OFErrorCodes = {
    PARSE_ERROR: string
    INVALID_CONTEXT: string
    FLAG_NOT_FOUND: string
}

export const OFErrorCodes: OFErrorCodes = {
    PARSE_ERROR: 'PARSE_ERROR',
    INVALID_CONTEXT: 'INVALID_CONTEXT', 
    FLAG_NOT_FOUND: 'FLAG_NOT_FOUND'
}