export const defaultSettings = {
  appearance: {
    theme: "system",
    reduceMotion: false,
    currency: "USD"
  },
  security: {
    "2fa": false,
    changePassword: null,      
    activeDevices: [],
    dangerZone: null
  },
  notifications: {
    loginAlerts: {
      email: true,
      webpush: true
    },
    newProducts: {
      email: false,
      webpush: true
    },
    orderUpdates: {
      email: true,
      webpush: true
    },
    promotions: {
      email: false,
      webpush: false
    }
  },
  billing: {
    invoiceEmail: ""
  }
}