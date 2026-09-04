// src/context/CurrencyContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ExchangeRates {
    USD: number;
    EUR: number;
    PKR: number;
    [key: string]: number;
}

interface CurrencyContextType {
    exchangeRates: ExchangeRates;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USD: 1, EUR: 0.86, PKR: 279 });

    useEffect(() => {
        fetch("https://api.frankfurter.dev/v1/latest?base=USD")
            .then((res) => {
                if (!res.ok) throw new Error("Network response error");
                return res.json();
            })
            .then((data: { rates?: Record<string, number> }) => {
              console.log(data,"currency data(exchangerate)")
                if (data?.rates) {
                    setExchangeRates({
                        USD: 1.0,
                        EUR: data.rates.EUR || 0.86,
                        PKR: data.rates.PKR || 279,
                    });
                }
            })
            .catch((err) => console.error("API Error, using fallback rates:", err));
    }, []);
    console.log("currency", exchangeRates)
    return <CurrencyContext.Provider value={{ exchangeRates }}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
    return context;
};
