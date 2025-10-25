// src/config/PRICING_CONFIG.js - Single Source of Truth for All Pricing
// ⚠️ IMPORTANT: All pricing changes should ONLY be made in this file

export const PRICING_CONFIG = {
  // Base Prices (INR)
  PRO_MONTHLY: 399,
  PRO_ANNUAL: 3999,
  ENTERPRISE_ANNUAL: 29999,
  ENTERPRISE_SEATS: 10,

  // Discounts
  STUDENT_DISCOUNT: 0.40, // 40% off
  ANNUAL_DISCOUNT_PERCENT: 16.7, // Calculated: (399*12 - 3999)/(399*12) * 100

  // Free Tier Limits
  FREE_DAILY_LIMIT: 5,
  FREE_SECTIONS: 6,
  FREE_REFERENCES_MAX: 15,

  // Pro Tier Features
  PRO_SECTIONS: 9,
  PRO_REFERENCES_MIN: 18,
  PRO_REFERENCES_MAX: 25,

  // Calculated Values
  get PRO_MONTHLY_STUDENT() {
    return Math.round(this.PRO_MONTHLY * (1 - this.STUDENT_DISCOUNT));
  },

  get PRO_ANNUAL_STUDENT() {
    return Math.round(this.PRO_ANNUAL * (1 - this.STUDENT_DISCOUNT));
  },

  get PRO_MONTHLY_ORIGINAL_ANNUAL() {
    return this.PRO_MONTHLY * 12;
  },

  get ANNUAL_SAVINGS() {
    return this.PRO_MONTHLY_ORIGINAL_ANNUAL - this.PRO_ANNUAL;
  },

  get ANNUAL_SAVINGS_STUDENT() {
    return (this.PRO_MONTHLY_STUDENT * 12) - this.PRO_ANNUAL_STUDENT;
  },

  get ENTERPRISE_PER_SEAT_ANNUAL() {
    return Math.round(this.ENTERPRISE_ANNUAL / this.ENTERPRISE_SEATS);
  },

  get ENTERPRISE_PER_SEAT_MONTHLY() {
    return Math.round(this.ENTERPRISE_PER_SEAT_ANNUAL / 12);
  },

  // Daily costs
  get PRO_DAILY_COST() {
    return Math.round(this.PRO_MONTHLY / 30);
  },

  get PRO_DAILY_COST_ANNUAL() {
    return Math.round(this.PRO_ANNUAL / 365);
  },

  get PRO_DAILY_COST_STUDENT() {
    return Math.round(this.PRO_MONTHLY_STUDENT / 30);
  },

  // Helper Functions
  getPrice(plan, isStudent = false) {
    switch (plan) {
      case 'pro-monthly':
        return isStudent ? this.PRO_MONTHLY_STUDENT : this.PRO_MONTHLY;
      case 'pro-annual':
        return isStudent ? this.PRO_ANNUAL_STUDENT : this.PRO_ANNUAL;
      case 'enterprise':
        return this.ENTERPRISE_ANNUAL;
      default:
        return 0;
    }
  },

  getPriceDetails(plan, isStudent = false) {
    const prices = {
      'pro-monthly': {
        original: this.PRO_MONTHLY,
        discounted: isStudent ? this.PRO_MONTHLY_STUDENT : this.PRO_MONTHLY,
        period: 'month',
        dailyCost: isStudent ? this.PRO_DAILY_COST_STUDENT : this.PRO_DAILY_COST,
        savings: 0,
        discount: isStudent ? this.STUDENT_DISCOUNT : 0
      },
      'pro-annual': {
        original: this.PRO_ANNUAL,
        discounted: isStudent ? this.PRO_ANNUAL_STUDENT : this.PRO_ANNUAL,
        originalMonthly: this.PRO_MONTHLY_ORIGINAL_ANNUAL,
        period: 'year',
        dailyCost: this.PRO_DAILY_COST_ANNUAL,
        savings: isStudent ? this.ANNUAL_SAVINGS_STUDENT : this.ANNUAL_SAVINGS,
        discount: isStudent ? this.STUDENT_DISCOUNT : 0,
        annualDiscountPercent: this.ANNUAL_DISCOUNT_PERCENT
      },
      'enterprise': {
        original: this.ENTERPRISE_ANNUAL,
        discounted: this.ENTERPRISE_ANNUAL,
        period: 'year',
        seats: this.ENTERPRISE_SEATS,
        perSeatAnnual: this.ENTERPRISE_PER_SEAT_ANNUAL,
        perSeatMonthly: this.ENTERPRISE_PER_SEAT_MONTHLY,
        savings: 0,
        discount: 0
      }
    };

    return prices[plan] || prices['pro-monthly'];
  },

  // Format currency
  formatPrice(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  // Get feature limits
  getFeatureLimits(tier) {
    const limits = {
      free: {
        dailyQueries: this.FREE_DAILY_LIMIT,
        sections: this.FREE_SECTIONS,
        referencesMax: this.FREE_REFERENCES_MAX,
        exports: ['text'],
        historyDays: 7
      },
      pro: {
        dailyQueries: -1, // Unlimited
        sections: this.PRO_SECTIONS,
        referencesMin: this.PRO_REFERENCES_MIN,
        referencesMax: this.PRO_REFERENCES_MAX,
        exports: ['pdf', 'bibtex', 'markdown', 'text'],
        historyDays: -1 // Unlimited
      },
      enterprise: {
        dailyQueries: -1, // Unlimited
        sections: this.PRO_SECTIONS,
        referencesMin: this.PRO_REFERENCES_MIN,
        referencesMax: this.PRO_REFERENCES_MAX,
        exports: ['pdf', 'bibtex', 'markdown', 'text'],
        historyDays: -1, // Unlimited
        teamFeatures: true
      }
    };

    return limits[tier] || limits.free;
  }
};

// Freeze the config to prevent accidental modifications
Object.freeze(PRICING_CONFIG);

export default PRICING_CONFIG;