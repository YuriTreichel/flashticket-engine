import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface ReservationTimerProps {
    expiresAt: string | Date;
    onExpired?: () => void;
    className?: string;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({
    expiresAt,
    onExpired,
    className = '',
}) => {
    const targetDate = new Date(expiresAt).getTime();
    const calculateTimeLeft = () =>
        Math.max(0, Math.floor((targetDate - Date.now()) / 1000));

    const [secondsLeft, setSecondsLeft] = useState<number>(calculateTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setSecondsLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                onExpired?.();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, onExpired]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const isUrgent = secondsLeft < 180; // less than 3 minutes

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (secondsLeft <= 0) {
        return (
            <div
                className={`flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500 ${className}`}
            >
                <AlertCircle className="h-4 w-4" />
                <span>Reservation hold expired</span>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isUrgent
                    ? 'animate-pulse border border-amber-500/30 bg-amber-500/10 text-amber-500'
                    : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
            } ${className}`}
        >
            <Clock className="h-4 w-4" />
            <span>
                Hold expires in:{' '}
                <strong className="font-mono tracking-wider">
                    {formattedTime}
                </strong>
            </span>
        </div>
    );
};
