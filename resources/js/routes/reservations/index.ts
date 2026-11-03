import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:27
 * @route '/reservations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reservations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:27
 * @route '/reservations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:27
 * @route '/reservations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:27
 * @route '/reservations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:27
 * @route '/reservations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
export const checkout = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(args, options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/reservations/{reservation}/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
checkout.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return checkout.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
checkout.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
checkout.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
    const checkoutForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
        checkoutForm.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservationController::checkout
 * @see app/Http/Controllers/ReservationController.php:55
 * @route '/reservations/{reservation}/checkout'
 */
        checkoutForm.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\ReservationController::tax
 * @see app/Http/Controllers/ReservationController.php:76
 * @route '/reservations/{reservation}/tax'
 */
export const tax = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tax.url(args, options),
    method: 'post',
})

tax.definition = {
    methods: ["post"],
    url: '/reservations/{reservation}/tax',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservationController::tax
 * @see app/Http/Controllers/ReservationController.php:76
 * @route '/reservations/{reservation}/tax'
 */
tax.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return tax.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::tax
 * @see app/Http/Controllers/ReservationController.php:76
 * @route '/reservations/{reservation}/tax'
 */
tax.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tax.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReservationController::tax
 * @see app/Http/Controllers/ReservationController.php:76
 * @route '/reservations/{reservation}/tax'
 */
    const taxForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: tax.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReservationController::tax
 * @see app/Http/Controllers/ReservationController.php:76
 * @route '/reservations/{reservation}/tax'
 */
        taxForm.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: tax.url(args, options),
            method: 'post',
        })
    
    tax.form = taxForm
/**
* @see \App\Http\Controllers\ReservationController::pay
 * @see app/Http/Controllers/ReservationController.php:108
 * @route '/reservations/{reservation}/pay'
 */
export const pay = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/reservations/{reservation}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservationController::pay
 * @see app/Http/Controllers/ReservationController.php:108
 * @route '/reservations/{reservation}/pay'
 */
pay.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return pay.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::pay
 * @see app/Http/Controllers/ReservationController.php:108
 * @route '/reservations/{reservation}/pay'
 */
pay.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReservationController::pay
 * @see app/Http/Controllers/ReservationController.php:108
 * @route '/reservations/{reservation}/pay'
 */
    const payForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: pay.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReservationController::pay
 * @see app/Http/Controllers/ReservationController.php:108
 * @route '/reservations/{reservation}/pay'
 */
        payForm.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: pay.url(args, options),
            method: 'post',
        })
    
    pay.form = payForm
const reservations = {
    store: Object.assign(store, store),
checkout: Object.assign(checkout, checkout),
tax: Object.assign(tax, tax),
pay: Object.assign(pay, pay),
}

export default reservations