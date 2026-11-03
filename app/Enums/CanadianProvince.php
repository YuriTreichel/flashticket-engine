<?php

declare(strict_types=1);

namespace App\Enums;

enum CanadianProvince: string
{
    case ON = 'ON'; // Ontario (13% HST)
    case QC = 'QC'; // Quebec (5% GST + 9.975% QST)
    case BC = 'BC'; // British Columbia (5% GST + 7% PST)
    case AB = 'AB'; // Alberta (5% GST)
    case MB = 'MB'; // Manitoba (5% GST + 7% PST)
    case SK = 'SK'; // Saskatchewan (5% GST + 6% PST)
    case NS = 'NS'; // Nova Scotia (15% HST)
    case NB = 'NB'; // New Brunswick (15% HST)
    case NL = 'NL'; // Newfoundland and Labrador (15% HST)
    case PE = 'PE'; // Prince Edward Island (15% HST)
    case NT = 'NT'; // Northwest Territories (5% GST)
    case NU = 'NU'; // Nunavut (5% GST)
    case YT = 'YT'; // Yukon (5% GST)

    /**
     * @return array{hst: float, gst: float, pst: float, qst: float}
     */
    public function taxRates(): array
    {
        return match ($this) {
            self::ON => ['hst' => 0.13, 'gst' => 0.0, 'pst' => 0.0, 'qst' => 0.0],
            self::QC => ['hst' => 0.0, 'gst' => 0.05, 'pst' => 0.0, 'qst' => 0.09975],
            self::BC => ['hst' => 0.0, 'gst' => 0.05, 'pst' => 0.07, 'qst' => 0.0],
            self::MB => ['hst' => 0.0, 'gst' => 0.05, 'pst' => 0.07, 'qst' => 0.0],
            self::SK => ['hst' => 0.0, 'gst' => 0.05, 'pst' => 0.06, 'qst' => 0.0],
            self::NS, self::NB, self::NL, self::PE => ['hst' => 0.15, 'gst' => 0.0, 'pst' => 0.0, 'qst' => 0.0],
            self::AB, self::NT, self::NU, self::YT => ['hst' => 0.0, 'gst' => 0.05, 'pst' => 0.0, 'qst' => 0.0],
        };
    }
}
