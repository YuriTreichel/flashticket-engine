<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Organizations (Cinemas, Theaters, Circuses, Promoters)
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('business_type')->default('theater'); // cinema, circus, theater, promoter, venue
            $table->string('city')->nullable();
            $table->string('logo_url')->nullable();
            $table->decimal('platform_fee_percent', 5, 2)->default(5.00); // SaaS fee (e.g. 5%)
            $table->string('status')->default('active'); // active, pending, suspended
            $table->timestamps();
        });

        // 2. Add role and organization_id to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('email'); // admin, organizer, customer
        });

        // 3. Link events to organizations
        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('id')->constrained('organizations')->nullOnDelete();
        });

        // 4. Ticket Variants (Adult, Student 50%, Child, Senior, Early Bird)
        Schema::create('ticket_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_tier_id')->constrained('ticket_tiers')->cascadeOnDelete();
            $table->string('name'); // e.g. "Standard Adult", "Student Half-Price", "Child (Under 12)"
            $table->string('category')->default('adult'); // adult, student, child, senior, promo
            $table->decimal('discount_percent', 5, 2)->default(0.00); // 0% = full price, 50% = half price
            $table->boolean('requires_id_proof')->default(false);
            $table->timestamps();
        });

        // 5. Update tickets and reservations to record variant type
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('ticket_variant_id')->nullable()->after('ticket_tier_id')->constrained('ticket_variants')->nullOnDelete();
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('ticket_variant_id')->nullable()->after('ticket_tier_id')->constrained('ticket_variants')->nullOnDelete();
            $table->string('variant_name')->nullable()->after('ticket_variant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['ticket_variant_id']);
            $table->dropColumn('ticket_variant_id');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['ticket_variant_id']);
            $table->dropColumn(['ticket_variant_id', 'variant_name']);
        });

        Schema::dropIfExists('ticket_variants');

        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::dropIfExists('organizations');
    }
};
