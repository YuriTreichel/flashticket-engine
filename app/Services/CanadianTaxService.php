<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\TaxCalculationResult;
use App\Enums\CanadianProvince;
use InvalidArgumentException;

class CanadianTaxService
{
    /**
     * Map first letter of Canadian Postal Code (Forward Sortation Area) to province.
     * Official Canada Post postal prefix mapping.
     */
    public function detectProvinceFromPostalCode(string $postalCode): CanadianProvince
    {
        $sanitized = strtoupper(trim(str_replace(' ', '', $postalCode)));

        if (! preg_match('/^[A-CEGHJ-NPR-TVXY]\d[A-CEGHJ-NPR-TV-Z]/i', $sanitized)) {
            throw new InvalidArgumentException("Invalid Canadian postal code format: {$postalCode}");
        }

        $prefix = $sanitized[0];

        return match ($prefix) {
            'A' => CanadianProvince::NL,
            'B' => CanadianProvince::NS,
            'C' => CanadianProvince::PE,
            'E' => CanadianProvince::NB,
            'G', 'H', 'J' => CanadianProvince::QC,
            'K', 'L', 'M', 'N', 'P' => CanadianProvince::ON,
            'R' => CanadianProvince::MB,
            'S' => CanadianProvince::SK,
            'T' => CanadianProvince::AB,
            'V' => CanadianProvince::BC,
            'X' => CanadianProvince::NT, // NT & NU share X, standard defaults to NT
            'Y' => CanadianProvince::YT,
            default => CanadianProvince::ON,
        };
    }

    public function calculate(float $subtotal, CanadianProvince $province): TaxCalculationResult
    {
        if ($subtotal < 0) {
            throw new InvalidArgumentException('Subtotal cannot be negative.');
        }

        $rates = $province->taxRates();

        $gst = round($subtotal * $rates['gst'], 2);
        $pst = round($subtotal * $rates['pst'], 2);
        $qst = round($subtotal * $rates['qst'], 2);
        $hst = round($subtotal * $rates['hst'], 2);

        $totalTax = round($gst + $pst + $qst + $hst, 2);
        $totalAmount = round($subtotal + $totalTax, 2);

        return new TaxCalculationResult(
            province: $province,
            subtotal: $subtotal,
            gstAmount: $gst,
            pstAmount: $pst,
            qstAmount: $qst,
            hstAmount: $hst,
            totalTax: $totalTax,
            totalAmount: $totalAmount,
        );
    }
}
