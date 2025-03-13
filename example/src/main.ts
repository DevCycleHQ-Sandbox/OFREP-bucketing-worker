import { AutoRouter, IRequest, json } from 'itty-router'
import { defaultHeaders } from './utils'
import { OpenFeature } from '@openfeature/server-sdk'
import { OFREPProvider } from '@openfeature/ofrep-provider'
import { EvaluationRequest } from '@openfeature/ofrep-core'
import { timedFn } from '../../src/utils/requests'

const router = AutoRouter()

interface Env {
    OFREP_BUCKETING: Fetcher
}
const flagKeys = {
    bool: 'ofrep-demo',
    string: 'ofrep-string',
    number: 'ofrep-num',
}

router.post('/test-evaluation/', async (request: IRequest, env: Env) => {
    const provider = new OFREPProvider({ 
        baseUrl: 'https://ofrep-bucketing-worker.devcycle.com', 
        fetchImplementation: (input: RequestInfo | URL, init?: RequestInit) => env.OFREP_BUCKETING.fetch(input, init),
        headers: [
            ['Content-Type', 'application/json'],
        ]
    })
    // Register your feature flag provider
    await OpenFeature.setProviderAndWait(provider);

    // create a new client
    const client = OpenFeature.getClient();

    // Bind the methods to preserve 'this' context
    const getBooleanValue = client.getBooleanValue.bind(client);
    const getStringValue = client.getStringValue.bind(client);
    const getNumberValue = client.getNumberValue.bind(client);

    // Evaluate your feature flag
    
    const evaluationRequest = await request.json() as EvaluationRequest
    if (!evaluationRequest.context) {
        throw new Error('Context is required')
    }
    const [boolEvaluationTime, boolVariable] = await timedFn(getBooleanValue, flagKeys.bool, false, evaluationRequest.context);
    const [stringEvaluationTime, stringVariable] = await timedFn(getStringValue, flagKeys.string, 'default', evaluationRequest.context);
    const [numberEvaluationTime, numberVariable] = await timedFn(getNumberValue, flagKeys.number, 100, evaluationRequest.context);
    const response = {
        [flagKeys.bool]: boolVariable,
        [flagKeys.string]: stringVariable,
        [flagKeys.number]: numberVariable,
        boolEvaluationTime,
        stringEvaluationTime,
        numberEvaluationTime,
    }
    return new Response(JSON.stringify(response), {
        headers: defaultHeaders,
    })
})

router.all('*', () => {
    throw new Error('Not Found')
})

export default {
    async fetch(req: IRequest, env: Env, ctx: ExecutionContext) {
        return router
            .fetch(req, env, ctx)
            .then(json)
            .catch((err: { status?: number; message: string }) => {
                console.error('err', err)
                const responseStatusCode = err.status || 500
                return json({ error: err.message }, { status: responseStatusCode })
            })
    },
} 