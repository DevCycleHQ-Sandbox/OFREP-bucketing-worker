import { IRequest } from 'itty-router'
import { defaultHeaders, validateOFContextFromRequest, variableToOFResponse,  timedFn } from '../utils'
import { generateBucketedConfig } from '@devcycle/bucketing'
import { fetchConfigFromCache } from '../utils/config'
import { OFErrorCodes, Env, } from '../types'
export async function getOpenFeatureVariables(
    request: IRequest, env: Env
): Promise<Response> {
    const user = await validateOFContextFromRequest(request)
    const [configFetchTime, config] = await timedFn(fetchConfigFromCache, { request, path: `/config/v2/server/${env.DVC_API_KEY}.json` })
    console.log('configFetchTime', configFetchTime)

    try {
        const [bucketingTime, bucketedConfig] = await timedFn(generateBucketedConfig, { config: config.configJSON, user, overrides: {} })
        console.log('bucketingTime', bucketingTime)
        const variableKey = request.params?.key?.toLowerCase()
        if (variableKey) {
            const variable = variableKey
                ? bucketedConfig.variables?.[variableKey]
                : null
            if (!variable) {
                return new Response(JSON.stringify({ error: OFErrorCodes.FLAG_NOT_FOUND }), {
                    status: 404,
                    headers: defaultHeaders,
                })
            }
    
            const featureVariation =
                bucketedConfig.variableVariationMap[variableKey]
            return new Response(
                JSON.stringify(variableToOFResponse(variable, featureVariation)),
                {
                    status: 200,
                    headers: defaultHeaders,
                },
            )
        } else {
            const evaluationResponses = Object.values(bucketedConfig.variables).map(
                (variable) => {
                    return variableToOFResponse(
                        variable,
                        bucketedConfig.variableVariationMap[variable.key],
                    )
                },
            )
    
            return new Response(
                JSON.stringify({ flags: evaluationResponses }),
                {
                    status: 200,
                    headers: defaultHeaders,
                },
            )
        } 
    } catch (error) {
        console.error('error', error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: defaultHeaders,
        })
    }
    
}
