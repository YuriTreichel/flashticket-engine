<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\TicketTier;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Event::factory(5)->has(TicketTier::factory()->count(3))->create();

        User::factory()->create([
            'name' => 'Usuário Teste',
            'email' => 'teste@teste.com',
            'password' => Hash::make('123'),
        ]);
    }
}
