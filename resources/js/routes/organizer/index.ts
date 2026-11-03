import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import events from './events'
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
const organizer = {
    dashboard: Object.assign(dashboard, dashboard),
events: Object.assign(events, events),
}

export default organizer