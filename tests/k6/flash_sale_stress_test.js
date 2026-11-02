import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Stress & Concurrency Test Configuration
// Simulates 500 concurrent virtual users competing for tickets in a flash sale
export const options = {
    scenarios: {
        flash_sale_spike: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 100 }, // Warm-up
                { duration: '30s', target: 500 }, // Peak spike load
                { duration: '10s', target: 0 },   // Cool-down
            ],
            gracefulRampDown: '5s',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
        http_req_failed: ['rate<0.05'],   // Less than 5% total network failures
    },
};

const BASE_URL = __ENV.APP_URL || 'http://localhost:8000';

export default function () {
    // 1. Browse Event Page
    const eventRes = http.get(`${BASE_URL}/events/1`);
    check(eventRes, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);

    // 2. Attempt Hold Tickets Reservation under high concurrency
    const payload = JSON.stringify({
        ticket_tier_id: 1,
        quantity: 2,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    };

    const reservationRes = http.post(`${BASE_URL}/reservations`, payload, params);

    // Either successfully holds tickets (200/302) or gracefully fails with InsufficientTickets (422)
    // NEVER unhandled server error (500)
    check(reservationRes, {
        'graceful response (success or sold out)': (r) => [200, 302, 422].includes(r.status),
        'no race condition 500 error': (r) => r.status !== 500,
    });

    sleep(1);
}
