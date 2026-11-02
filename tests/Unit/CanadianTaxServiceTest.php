<?php

declare(strict_types=1);

use App\Enums\CanadianProvince;
use App\Services\CanadianTaxService;

beforeEach(function () {
    $this->taxService = new CanadianTaxService;
});

test('it correctly maps postal code prefixes to Canadian provinces', function (string $postalCode, CanadianProvince $expectedProvince) {
    $province = $this->taxService->detectProvinceFromPostalCode($postalCode);
    expect($province)->toBe($expectedProvince);
})->with([
    ['M5V 2T6', CanadianProvince::ON], // Toronto, ON
    ['H2X 1Y4', CanadianProvince::QC], // Montreal, QC
    ['V6B 1A1', CanadianProvince::BC], // Vancouver, BC
    ['T2P 1J9', CanadianProvince::AB], // Calgary, AB
    ['R3C 4T3', CanadianProvince::MB], // Winnipeg, MB
    ['S7K 1N2', CanadianProvince::SK], // Saskatoon, SK
    ['B3H 1X5', CanadianProvince::NS], // Halifax, NS
]);

test('it calculates Ontario 13% HST correctly', function () {
    $result = $this->taxService->calculate(subtotal: 100.00, province: CanadianProvince::ON);

    expect($result->hstAmount)->toBe(13.00)
        ->and($result->gstAmount)->toBe(0.0)
        ->and($result->pstAmount)->toBe(0.0)
        ->and($result->totalTax)->toBe(13.00)
        ->and($result->totalAmount)->toBe(113.00);
});

test('it calculates British Columbia 5% GST + 7% PST correctly', function () {
    $result = $this->taxService->calculate(subtotal: 100.00, province: CanadianProvince::BC);

    expect($result->gstAmount)->toBe(5.00)
        ->and($result->pstAmount)->toBe(7.00)
        ->and($result->hstAmount)->toBe(0.0)
        ->and($result->totalTax)->toBe(12.00)
        ->and($result->totalAmount)->toBe(112.00);
});

test('it calculates Quebec 5% GST + 9.975% QST correctly', function () {
    $result = $this->taxService->calculate(subtotal: 100.00, province: CanadianProvince::QC);

    expect($result->gstAmount)->toBe(5.00)
        ->and($result->qstAmount)->toBe(9.98) // 9.975 rounded
        ->and($result->totalTax)->toBe(14.98)
        ->and($result->totalAmount)->toBe(114.98);
});

test('it calculates Alberta 5% GST only correctly', function () {
    $result = $this->taxService->calculate(subtotal: 200.00, province: CanadianProvince::AB);

    expect($result->gstAmount)->toBe(10.00)
        ->and($result->pstAmount)->toBe(0.0)
        ->and($result->totalTax)->toBe(10.00)
        ->and($result->totalAmount)->toBe(210.00);
});

test('it throws InvalidArgumentException on invalid postal codes', function () {
    $this->taxService->detectProvinceFromPostalCode('INVALID_CODE');
})->throws(InvalidArgumentException::class);
