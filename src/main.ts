import { AutoRouter, IRequest, json } from 'itty-router'
import { defaultHeaders } from './utils/requests'
import { getOpenFeatureVariables } from './routes'

const router = AutoRouter()

// OpenFeature Remote Evaluation Protocol
router.post(
    '/ofrep/v1/evaluate/flags/:key?',
    getOpenFeatureVariables,
)

router.options('/ofrep/v1/evaluate/flags/(.*)', () => {
    return new Response(null, {
        status: 200,
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
                console.log('err', err)
                const responseStatusCode = err.status || 500
                return json({ error: err.message }, { status: responseStatusCode })
            })
    },
}