import { useState, useEffect, useCallback, useRef } from 'react';

export const useCountdown = (initialTime: number) => {
    const [countdown, setCountdown] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = useCallback(() => {
        setCountdown(initialTime);
        setIsActive(true);
    }, [initialTime]);

    const stopTimer = useCallback(() => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (isActive && countdown > 0) {
            timerRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            stopTimer();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, countdown, stopTimer]);

    return { countdown, isActive, startTimer, stopTimer };
};