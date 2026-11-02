<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\CanadianProvince;

final readonly class TaxCalculationResult
{
    public function __construct(
        public CanadianProvince $province,
        public float $subtotal,
        public float $gstAmount,
        public float $pstAmount,
        public float $qstAmount,
        public float $hstAmount,
        public float $totalTax,
        public float $totalAmount,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'province' => $this->province->value,
            'subtotal' => $this->subtotal,
            'gst_amount' => $this->gstAmount,
            'pst_amount' => $this->pstAmount,
            'qst_amount' => $this->qstAmount,
            'hst_amount' => $this->hstAmount,
            'total_tax' => $this->totalTax,
            'total_amount' => $this->totalAmount,
        ];
    }
}
