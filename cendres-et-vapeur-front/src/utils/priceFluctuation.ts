/**
 * Système de variation des prix dynamique côté frontend
 * Compatible avec le backend Python PriceFluctuation
 */

export class PriceFluctuation {
    static readonly MAX_PRICE_CHANGE = 50;

    /**
     * Calcule le niveau de demande
     * Les achats pèsent 3x plus que les consultations
     */
    static calculateDemand(viewCount: number, purchaseCount: number): number {
        return viewCount + (purchaseCount * 3);
    }

    /**
     * Calcule le ratio offre/demande
     * Offre = stock_actuel / stock_initial (en %)
     * Ratio = Offre / Demande
     */
    static calculateSupplyRatio(
        currentStock: number,
        baseStock: number,
        demand: number
    ): number {
        if (demand === 0 || baseStock === 0) {
            return 1.0;
        }

        const supplyPercentage = (currentStock / baseStock) * 100;
        return supplyPercentage / Math.max(demand, 1);
    }

    /**
     * Calcule la variation % du prix en fonction de l'offre/demande
     *
     * Si supply_ratio < 1:  Pénurie → Prix ↑
     *   - Plus bas le ratio, plus fort la hausse
     *   - Formule: (1 - ratio) × 100
     *
     * Si supply_ratio > 1: Surstock → Prix ↓
     *   - Plus haut le ratio, plus forte la baisse
     *   - Formule: -(ratio - 1) × 30
     *
     * Si supply_ratio ≈ 1: Équilibre → Prix stable
     */
    static calculatePriceChange(supplyRatio: number): number {
        if (supplyRatio < 1) {
            const priceChange = (1 - supplyRatio) * 100;
            return Math.min(priceChange, PriceFluctuation.MAX_PRICE_CHANGE);
        } else {
            const priceChange = -(supplyRatio - 1) * 30;
            return Math.max(priceChange, -PriceFluctuation.MAX_PRICE_CHANGE);
        }
    }

    /**
     * Calcule le nouveau prix basé sur l'offre/demande
     */
    static calculateNewPrice(
        basePrice: number,
        currentPrice: number,
        currentStock: number,
        baseStock: number,
        viewCount: number,
        purchaseCount: number
    ): {
        old_price: number;
        new_price: number;
        price_change_percent: number;
        indicator: {
            arrow: string;
            trend: string;
            color: string;
            label: string;
        };
        supply_ratio: number;
        demand: number;
        stock: number;
    } {
        const demand = PriceFluctuation.calculateDemand(viewCount, purchaseCount);

        const supplyRatio = PriceFluctuation.calculateSupplyRatio(
            currentStock,
            baseStock,
            demand
        );

        const priceChangePercent = PriceFluctuation.calculatePriceChange(supplyRatio);

        let newPrice = currentPrice * (1 + priceChangePercent / 100);

        const minPrice = basePrice * 0.1;
        const maxPrice = basePrice * 2.0;
        newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

        const indicator = PriceFluctuation.getTrendIndicator(priceChangePercent);

        return {
            old_price: currentPrice,
            new_price: newPrice,
            price_change_percent: priceChangePercent,
            indicator,
            supply_ratio: supplyRatio,
            demand: Math.floor(demand),
            stock: currentStock,
        };
    }

    /**
     * Retourne l'indicateur visuel (flèche, couleur)
     */
    static getTrendIndicator(
        priceChangePercent: number
    ): { arrow: string; trend: string; color: string; label: string } {
        if (priceChangePercent > 5) {
            return {
                arrow: ' ↑',
                trend: 'UP',
                color: 'green',
                label: `+${priceChangePercent.toFixed(2)}%`,
            };
        } else if (priceChangePercent < -5) {
            return {
                arrow: ' ↓',
                trend: 'DOWN',
                color: 'red',
                label: `${priceChangePercent.toFixed(2)}%`,
            };
        } else {
            return {
                arrow: ' →',
                trend: 'STABLE',
                color: 'gray',
                label: `${priceChangePercent.toFixed(2)}%`,
            };
        }
    }
}
