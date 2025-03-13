import { ConfigBody } from '@devcycle/types'
import { IRequest } from 'itty-router'


declare const CONFIG_FETCH_RETRIES: string
const configFetchRetry =
    typeof CONFIG_FETCH_RETRIES === 'undefined'
        ? 2
        : Number(CONFIG_FETCH_RETRIES)

export type FetchFromCacheParams = {
    request: IRequest
    path: string
    sdkType?: string
    headers?: { [key: string]: string }
    retryData?: {
        stale: boolean
        retries: number
    }
}

export type FetchFromCacheResponse = {
    configJSON: ConfigBody
    configString: string
    etag?: string
    cached: boolean
}

export const fetchConfigFromCache = async ({
    request,
    path,
}: FetchFromCacheParams): Promise<FetchFromCacheResponse> => {
    return await fetchFromCDNWithRetry({
        request,
        path,
        sdkType: 'server',
    })
}

const fetchFromCDN = async ({
    request,
    path: key,
    retryData = {
        retries: 0,
        stale: false,
    },
}: FetchFromCacheParams): Promise<FetchFromCacheResponse> => {
    try {
        const url = `https://config-cdn.devcycle.com${key}`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Config not found in CDN: ${key}`)
        }

        const configString = await response.text()
        console.log('CDN Cache Status:', response.headers.get('cf-cache-status'))
        
        return {
            configJSON: JSON.parse(configString),
            configString,
            etag: response.headers.get('ETag') || undefined,
            cached: false,
        }
    } catch (error) {
        if (retryData?.retries < configFetchRetry) {
            retryData.retries++
            retryData.stale = true
            return await fetchFromCDN({
                path: key,
                request,
                retryData,
            })
        } else {
            throw error
        }
    }
}

export const fetchFromCDNWithRetry = async (
    params: FetchFromCacheParams,
) => {
    params.retryData = {
        retries: 0,
        stale: false,
    }
    return await fetchFromCDN(params)
}