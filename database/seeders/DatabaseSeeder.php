<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Event;
use App\Models\TicketTier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Demo User for quick login
        User::query()->updateOrCreate(
            ['email' => 'teste@teste.com'],
            [
                'name' => 'Alex Morgan (Senior Engineer)',
                'password' => Hash::make('123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Realistic Canadian Tech & Entertainment Events (Luma / DICE style)
        $eventsData = [
            [
                'name' => 'Toronto Tech Summit & AI Concurrency 2026',
                'description' => 'The premier gathering of distributed systems engineers, AI founders, and cloud architects across North America. Keynotes from leading tech giants.',
                'location' => 'Metro Toronto Convention Centre, ON',
                'image_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Technology',
                'start_date' => now()->addDays(14)->setTime(9, 30),
                'end_date' => now()->addDays(15)->setTime(18, 00),
                'tiers' => [
                    ['name' => 'Early Bird Access', 'price' => 149.00, 'total_quantity' => 100],
                    ['name' => 'General Admission', 'price' => 299.00, 'total_quantity' => 250],
                    ['name' => 'VIP Executive Pass', 'price' => 599.00, 'total_quantity' => 50],
                ],
            ],
            [
                'name' => 'Neon Horizon — Electronic & Synthwave Festival',
                'description' => 'A visually stunning cyberpunk audiovisual immersion with laser projection mapping, spatial audio, and headliners from Montreal and Berlin.',
                'location' => 'Rebel Entertainment Complex, Toronto, ON',
                'image_url' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Music',
                'start_date' => now()->addDays(21)->setTime(21, 00),
                'end_date' => now()->addDays(22)->setTime(4, 00),
                'tiers' => [
                    ['name' => 'Pista / Dancefloor', 'price' => 65.00, 'total_quantity' => 400],
                    ['name' => 'Mezzanine Balcony', 'price' => 95.00, 'total_quantity' => 150],
                    ['name' => 'VIP Backstage Experience', 'price' => 220.00, 'total_quantity' => 30],
                ],
            ],
            [
                'name' => 'Vancouver Craft Beer & Culinary Night Market',
                'description' => 'Taste award-winning craft breweries from across British Columbia, live acoustic jazz, and artisanal culinary showcases by top chefs.',
                'location' => 'Vancouver Convention Centre (West Building), BC',
                'image_url' => 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Food & Drink',
                'start_date' => now()->addDays(8)->setTime(17, 00),
                'end_date' => now()->addDays(8)->setTime(23, 00),
                'tiers' => [
                    ['name' => 'Tasting Pass (5 Tokens)', 'price' => 45.00, 'total_quantity' => 300],
                    ['name' => 'Unlimited Connoisseur Pass', 'price' => 85.00, 'total_quantity' => 100],
                ],
            ],
            [
                'name' => 'Montreal Winter Indie & Underground Film Fest',
                'description' => 'Seven nights celebrating boundary-pushing cinema, interactive virtual reality storytelling, and Q&As with independent Canadian directors.',
                'location' => 'Cinéma du Musée, Montréal, QC',
                'image_url' => 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Arts & Film',
                'start_date' => now()->addDays(30)->setTime(19, 00),
                'end_date' => now()->addDays(35)->setTime(22, 30),
                'tiers' => [
                    ['name' => 'Single Film Screening', 'price' => 18.00, 'total_quantity' => 120],
                    ['name' => 'All-Access Festival Badge', 'price' => 120.00, 'total_quantity' => 60],
                ],
            ],
            [
                'name' => 'Calgary Global Fintech & Blockchain Summit',
                'description' => 'Explore the future of algorithmic trading, instant payments infrastructure, smart contract security, and digital assets governance.',
                'location' => 'TELUS Convention Centre, Calgary, AB',
                'image_url' => 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Technology',
                'start_date' => now()->addDays(45)->setTime(9, 00),
                'end_date' => now()->addDays(46)->setTime(17, 30),
                'tiers' => [
                    ['name' => 'Standard Delegate Pass', 'price' => 350.00, 'total_quantity' => 200],
                    ['name' => 'Investor & Founder Pass', 'price' => 750.00, 'total_quantity' => 40],
                ],
            ],
            [
                'name' => 'Halifax Atlantic Harbor Lights & Drone Symphony',
                'description' => 'A breathtaking open-air harbor spectacle combining an orchestrated live symphony orchestra with 1,000 synchronized illuminated drones.',
                'location' => 'Halifax Waterfront Boardwalk, NS',
                'image_url' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Music',
                'start_date' => now()->addDays(18)->setTime(20, 00),
                'end_date' => now()->addDays(18)->setTime(22, 00),
                'tiers' => [
                    ['name' => 'Boardwalk General Admission', 'price' => 30.00, 'total_quantity' => 500],
                    ['name' => 'Harbor Front Row Seating', 'price' => 75.00, 'total_quantity' => 120],
                ],
            ],
        ];

        // Clean existing mock data and re-insert high quality events
        TicketTier::query()->delete();
        Event::query()->delete();

        foreach ($eventsData as $eventInfo) {
            $tiers = $eventInfo['tiers'];
            unset($eventInfo['tiers']);

            /** @var Event $event */
            $event = Event::create($eventInfo);

            foreach ($tiers as $tier) {
                TicketTier::create([
                    'event_id' => $event->id,
                    'name' => $tier['name'],
                    'price' => $tier['price'],
                    'total_quantity' => $tier['total_quantity'],
                ]);
            }
        }
    }
}
