import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/organizer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizerController::dashboard
 * @see app/Http/Controllers/OrganizerController.php:19
 * @route '/organizer/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/organizer/events/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizerController::create
 * @see app/Http/Controllers/OrganizerController.php:30
 * @route '/organizer/events/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\OrganizerController::store
 * @see app/Http/Controllers/OrganizerController.php:35
 * @route '/organizer/events'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizer/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizerController::store
 * @see app/Http/Controllers/OrganizerController.php:35
 * @route '/organizer/events'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizerController::store
 * @see app/Http/Controllers/OrganizerController.php:35
 * @route '/organizer/events'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizerController::store
 * @see app/Http/Controllers/OrganizerController.php:35
 * @route '/organizer/events'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizerController::store
 * @see app/Http/Controllers/OrganizerController.php:35
 * @route '/organizer/events'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
export const scanner = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scanner.url(args, options),
    method: 'get',
})

scanner.definition = {
    methods: ["get","head"],
    url: '/organizer/events/{event}/scanner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
scanner.url = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { event: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { event: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        event: typeof args.event === 'object'
                ? args.event.id
                : args.event,
                }

    return scanner.definition.url
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
scanner.get = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scanner.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
scanner.head = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scanner.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
    const scannerForm = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scanner.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
        scannerForm.get = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scanner.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizerController::scanner
 * @see app/Http/Controllers/OrganizerController.php:73
 * @route '/organizer/events/{event}/scanner'
 */
        scannerForm.head = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scanner.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scanner.form = scannerForm
/**
* @see \App\Http\Controllers\OrganizerController::checkIn
 * @see app/Http/Controllers/OrganizerController.php:80
 * @route '/organizer/events/{event}/check-in'
 */
export const checkIn = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

checkIn.definition = {
    methods: ["post"],
    url: '/organizer/events/{event}/check-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizerController::checkIn
 * @see app/Http/Controllers/OrganizerController.php:80
 * @route '/organizer/events/{event}/check-in'
 */
checkIn.url = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { event: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { event: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        event: typeof args.event === 'object'
                ? args.event.id
                : args.event,
                }

    return checkIn.definition.url
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizerController::checkIn
 * @see app/Http/Controllers/OrganizerController.php:80
 * @route '/organizer/events/{event}/check-in'
 */
checkIn.post = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizerController::checkIn
 * @see app/Http/Controllers/OrganizerController.php:80
 * @route '/organizer/events/{event}/check-in'
 */
    const checkInForm = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkIn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizerController::checkIn
 * @see app/Http/Controllers/OrganizerController.php:80
 * @route '/organizer/events/{event}/check-in'
 */
        checkInForm.post = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkIn.url(args, options),
            method: 'post',
        })
    
    checkIn.form = checkInForm
const OrganizerController = { dashboard, create, store, scanner, checkIn }

export default OrganizerController