import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
export const architecture = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: architecture.url(options),
    method: 'get',
})

architecture.definition = {
    methods: ["get","head"],
    url: '/architecture',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
architecture.url = (options?: RouteQueryOptions) => {
    return architecture.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
architecture.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: architecture.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
architecture.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: architecture.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
    const architectureForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: architecture.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
        architectureForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: architecture.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PlatformController::architecture
 * @see app/Http/Controllers/PlatformController.php:20
 * @route '/architecture'
 */
        architectureForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: architecture.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    architecture.form = architectureForm
/**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
export const metrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})

metrics.definition = {
    methods: ["get","head"],
    url: '/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
metrics.url = (options?: RouteQueryOptions) => {
    return metrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
metrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
metrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
    const metricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
        metricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PlatformController::metrics
 * @see app/Http/Controllers/PlatformController.php:28
 * @route '/metrics'
 */
        metricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metrics.form = metricsForm
const PlatformController = { architecture, metrics }

export default PlatformController