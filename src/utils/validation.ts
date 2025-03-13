import { DVCAPIUser, SDKVariable } from "@devcycle/types";
import { EvaluationRequest, EvaluationResponse, FeatureVariation } from "../types";

export function validateUser(userData: unknown): DVCAPIUser {
    if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data')
    }

    const user = userData as Record<string, unknown>
    
    if (!user.user_id || typeof user.user_id !== 'string') {
        throw new Error('Missing or invalid user_id')
    }

    return userData as DVCAPIUser
}

export function variableToOFResponse(
    variable: SDKVariable,
    featureVariation: FeatureVariation,
): EvaluationResponse {
    return {
        key: variable.key,
        reason: 'TARGETING_MATCH',
        variant: featureVariation
            ? `${featureVariation._feature}:${featureVariation._variation}`
            : '',
        metaData: { type: variable.type },
        value: variable.value,
    }
}

export async function validateOFContextFromRequest(
    request: Request,
): Promise<DVCAPIUser> {
    let requestBody
    try {
        requestBody = await request.json() as EvaluationRequest
    } catch (ex) {
        throw new Error('Invalid JSON body')
    }

    if (!requestBody?.context || typeof requestBody.context !== 'object') {
        throw new Error('Missing context in JSON body')
    }

    const { context } = requestBody
    
    if (!context.user_id && context.targetingKey) {
        context.user_id = context.targetingKey
    }

    if (!context.user_id || typeof context.user_id !== 'string') {
        throw new Error('Missing targetingKey or user_id in context')
    }

    return context as DVCAPIUser
}


export async function validateUserFromRequest(
    request: Request,
    userRequestData?: unknown,
): Promise<DVCAPIUser> {
    let userData
    try {
        userData =
            userRequestData ||
            (request.body ? await request.json() : null)
    } catch (ex) {
        throw new Error('Invalid JSON body')
    }
    if (!userData) {
        throw new Error('Missing JSON body')
    }

    return validateUser(userData)
}