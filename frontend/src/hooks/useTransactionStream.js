import { useState, useEffect, useRef } from 'react';

const MAX_FEED_ITEMS = 50;
const WS_URL = 'ws://localhost:8000/ws/transactions';

export const useTransactionStream = () => {
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({
        totalProcessed: 0,
        fraudCaught: 0,
        latency: 0
    });
    const [isConnected, setIsConnected] = useState(false);

    const ws = useRef(null);

    useEffect(() => {
        const connect = () => {
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                setIsConnected(true);
                console.log('Connected to Transaction Stream');
            };

            ws.current.onclose = () => {
                setIsConnected(false);
                console.log('Disconnected from stream, reconnecting...');
                setTimeout(connect, 3000);
            };

            ws.current.onmessage = (event) => {
                try {
                    const txn = JSON.parse(event.data);

                    // Update Feed (Limit to MAX_FEED_ITEMS)
                    setTransactions(prev => {
                        const newFeed = [txn, ...prev];
                        return newFeed.slice(0, MAX_FEED_ITEMS);
                    });

                    // Handle Alerts
                    if (txn.status !== 'Approved') {
                        setAlerts(prev => [txn, ...prev]);
                        setStats(s => ({ ...s, fraudCaught: s.fraudCaught + 1 }));
                    }

                    // Update Stats
                    setStats(s => ({
                        ...s,
                        totalProcessed: s.totalProcessed + 1,
                        latency: txn.latency_ms
                    }));

                } catch (err) {
                    console.error('Error parsing transaction:', err);
                }
            };
        };

        connect();

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    return { transactions, alerts, stats, isConnected };
};
