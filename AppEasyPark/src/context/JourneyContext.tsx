import React, { createContext, useState, ReactNode } from 'react';
import { useCountdown } from '../hooks/useCountdown';

export const JourneyContext = createContext<any>({});

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
    const { countdown: journeyCountdown, startTimer: startJourneyTimer, stopTimer: stopJourneyTimer } = useCountdown(900); // 15 min
    const [isActiveReservation, setIsActiveReservation] = useState(false);
    const [reservationStatus, setReservationStatus] = useState<'PRE_RESERVA' | 'RESERVA'>('PRE_RESERVA');
    const [reservedSpot, setReservedSpot] = useState<any>(null);
    const [isJourneyMinimized, setIsJourneyMinimized] = useState(false);

    return (
        <JourneyContext.Provider value={{
            journeyCountdown, startJourneyTimer, stopJourneyTimer,
            isActiveReservation, setIsActiveReservation,
            reservationStatus, setReservationStatus,
            reservedSpot, setReservedSpot,
            isJourneyMinimized, setIsJourneyMinimized
        }}>
            {children}
        </JourneyContext.Provider>
    );
};