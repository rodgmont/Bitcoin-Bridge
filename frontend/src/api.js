const API_BASE = 'http://localhost:8000/api';

class ApiService {
    static async getCurrentPrice() {
        try {
            const response = await fetch(`${API_BASE}/btc/current`);
            if (!response.ok) throw new Error('Failed to fetch current price');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getHistoricalPrice(dateString) {
        try {
            const response = await fetch(`${API_BASE}/btc/historical?target_date=${dateString}`);
            if (!response.ok) throw new Error('Failed to fetch historical price');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async calculateImpact(usdAmount, dateString) {
        try {
            const response = await fetch(`${API_BASE}/btc/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usd_amount: Number(usdAmount),
                    date: dateString
                })
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Failed to calculate impact');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
