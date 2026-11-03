<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Event;
use App\Models\Organization;
use App\Models\TicketTier;
use App\Models\TicketVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Root Platform Admin (You / SaaS Owner)
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@flashticket.io'],
            [
                'name' => 'FlashTicket Platform Admin',
                'role' => UserRole::ADMIN,
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Organizer Users (Tenants)
        $cinemaOwner = User::query()->updateOrCreate(
            ['email' => 'cinema@toronto.ca'],
            [
                'name' => 'Scotiabank Cineplex Toronto',
                'role' => UserRole::ORGANIZER,
                'password' => Hash::make('cinema123'),
                'email_verified_at' => now(),
            ]
        );

        $theaterOwner = User::query()->updateOrCreate(
            ['email' => 'theater@montreal.ca'],
            [
                'name' => 'Place des Arts Montréal',
                'role' => UserRole::ORGANIZER,
                'password' => Hash::make('theater123'),
                'email_verified_at' => now(),
            ]
        );

        $circusOwner = User::query()->updateOrCreate(
            ['email' => 'circus@vancouver.ca'],
            [
                'name' => 'Cirque Royal Vancouver',
                'role' => UserRole::ORGANIZER,
                'password' => Hash::make('circus123'),
                'email_verified_at' => now(),
            ]
        );

        // 3. Demo Buyer / Customer
        $customer = User::query()->updateOrCreate(
            ['email' => 'teste@teste.com'],
            [
                'name' => 'Alex Morgan (Customer)',
                'role' => UserRole::CUSTOMER,
                'password' => Hash::make('123'),
                'email_verified_at' => now(),
            ]
        );

        // 4. Create Client Organizations (B2B SaaS Clients)
        $orgCinema = Organization::query()->updateOrCreate(
            ['name' => 'Scotiabank Cineplex Downtown'],
            [
                'user_id' => $cinemaOwner->id,
                'business_type' => 'cinema',
                'city' => 'Toronto, ON',
                'platform_fee_percent' => 5.00,
                'status' => 'active',
            ]
        );

        $orgTheater = Organization::query()->updateOrCreate(
            ['name' => 'Place des Arts Grand Theater'],
            [
                'user_id' => $theaterOwner->id,
                'business_type' => 'theater',
                'city' => 'Montréal, QC',
                'platform_fee_percent' => 5.00,
                'status' => 'active',
            ]
        );

        $orgCircus = Organization::query()->updateOrCreate(
            ['name' => 'Cirque Royal Big Top Arena'],
            [
                'user_id' => $circusOwner->id,
                'business_type' => 'circus',
                'city' => 'Vancouver, BC',
                'platform_fee_percent' => 4.50,
                'status' => 'active',
            ]
        );

        // 5. Clean up old mock records
        TicketVariant::query()->delete();
        TicketTier::query()->delete();
        Event::query()->delete();

        // 6. Create Real Events with Multi-Ticket Variants (Adult, Student 50%, Child, Senior)
        $eventsData = [
            [
                'organization_id' => $orgCinema->id,
                'name' => 'IMAX 70mm Premiere: Oppenheimer & 2001 Odyssey',
                'description' => 'Exclusive dual-feature 70mm IMAX film exhibition with director Q&A, spatial Dolby Atmos sound and digital laser projection.',
                'location' => 'Scotiabank Theatre Cinema 1, Toronto, ON',
                'image_url' => 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Cinema',
                'start_date' => now()->addDays(7)->setTime(19, 00),
                'tiers' => [
                    [
                        'name' => 'Prime Center IMAX Seats',
                        'price' => 28.00,
                        'total_quantity' => 180,
                        'variants' => [
                            ['name' => 'Adult (Standard)', 'category' => 'adult', 'discount_percent' => 0.00, 'requires_id_proof' => false],
                            ['name' => 'Student (50% Off)', 'category' => 'student', 'discount_percent' => 50.00, 'requires_id_proof' => true],
                            ['name' => 'Child (Under 12)', 'category' => 'child', 'discount_percent' => 60.00, 'requires_id_proof' => false],
                            ['name' => 'Senior Citizen (65+)', 'category' => 'senior', 'discount_percent' => 40.00, 'requires_id_proof' => true],
                        ],
                    ],
                ],
            ],
            [
                'organization_id' => $orgCircus->id,
                'name' => 'Cirque Électrique — Gravity Defying Acrobatic Arena',
                'description' => 'A world-class contemporary circus featuring high-wire aerialists, neon trampoline acts, pyrotechnics and a live 10-piece brass band.',
                'location' => 'Pacific National Exhibition Arena, Vancouver, BC',
                'image_url' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Circus',
                'start_date' => now()->addDays(14)->setTime(18, 30),
                'tiers' => [
                    [
                        'name' => 'Ringside Family Tier',
                        'price' => 60.00,
                        'total_quantity' => 250,
                        'variants' => [
                            ['name' => 'Standard Adult', 'category' => 'adult', 'discount_percent' => 0.00, 'requires_id_proof' => false],
                            ['name' => 'Student Pass', 'category' => 'student', 'discount_percent' => 50.00, 'requires_id_proof' => true],
                            ['name' => 'Kids Magic Pass (Under 10)', 'category' => 'child', 'discount_percent' => 70.00, 'requires_id_proof' => false],
                        ],
                    ],
                ],
            ],
            [
                'organization_id' => $orgTheater->id,
                'name' => 'The Phantom of the Opera — Broadway Musical Tour',
                'description' => 'Cameron Mackintosh’s spectacular new production of Andrew Lloyd Webber’s phenomenal musical triumph.',
                'location' => 'Salle Wilfrid-Pelletier, Montréal, QC',
                'image_url' => 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
                'category' => 'Theater',
                'start_date' => now()->addDays(20)->setTime(20, 00),
                'tiers' => [
                    [
                        'name' => 'Orchestra Front Stalls',
                        'price' => 110.00,
                        'total_quantity' => 300,
                        'variants' => [
                            ['name' => 'Full Admission (Adult)', 'category' => 'adult', 'discount_percent' => 0.00, 'requires_id_proof' => false],
                            ['name' => 'Student Matinee / Meia-Entrada', 'category' => 'student', 'discount_percent' => 50.00, 'requires_id_proof' => true],
                            ['name' => 'Youth Theater Pass', 'category' => 'child', 'discount_percent' => 50.00, 'requires_id_proof' => false],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($eventsData as $eventInfo) {
            $tiers = $eventInfo['tiers'];
            unset($eventInfo['tiers']);

            /** @var Event $event */
            $event = Event::create($eventInfo);

            foreach ($tiers as $tierInfo) {
                $variants = $tierInfo['variants'];
                unset($tierInfo['variants']);

                /** @var TicketTier $tier */
                $tier = TicketTier::create([
                    'event_id' => $event->id,
                    'name' => $tierInfo['name'],
                    'price' => $tierInfo['price'],
                    'total_quantity' => $tierInfo['total_quantity'],
                ]);

                foreach ($variants as $variant) {
                    TicketVariant::create([
                        'ticket_tier_id' => $tier->id,
                        'name' => $variant['name'],
                        'category' => $variant['category'],
                        'discount_percent' => $variant['discount_percent'],
                        'requires_id_proof' => $variant['requires_id_proof'],
                    ]);
                }
            }
        }
    }
}
