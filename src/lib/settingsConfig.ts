import React from "react"
import { BellDot, Palette } from "lucide-react";
import { UserLock } from "lucide-react";
import { Shield } from "lucide-react";
import { WalletCards } from "lucide-react";
import { RefObject } from "react";
import { Moon,Sun,Monitor } from "lucide-react";
import { Euro,Banknote, DollarSign } from "lucide-react";
type FieldType = "toggle" | "select" | "action" | "list" | "toggle-group" | "danger" | "email" | "address"

export type Field = {
  key: string
  label: string
  description?: string
  icon:React.ElementType[]|null;
  type: FieldType
  default?: unknown
  global?: boolean
  options?: string[]
  channels?: string[]
}

type Section = {
  key: string
  title: string;
  icon:React.ElementType
  fields: Field[];
}

export const settingsConfig: Section[] = [
  {
    key: "appearance",
    title: "Appearance",
    icon: Palette ,
    fields: [
      {
        key: "theme",
        icon: [Sun,Moon,Monitor],
        label: "Theme",
        description: "Choose your preferred display theme across Zenfith",
        type: "select",
        options: ["light", "dark", "system"],
        default: "system",
        global: true
      },
      {
        icon:null,
        key: "reduceMotion",
        label: "Reduce Motion",
        description: "Minimizes animations and transitions across the interface",
        type: "toggle",
        default: false,
        global: true
      },
      {
        key: "currency",
        icon: [DollarSign,Banknote,Euro],
        label: "Currency",
        description: "Set your preferred currency for all pricing and totals",
        type: "select",
        options: ["USD", "PKR", "EUR"],
        default: "USD",
        global: true
      }
    ]
  },
  {
    key: "security",
    title: "Security",
    icon:UserLock,
    fields: [
      {
        icon:null,
        key: "2fa",
        label: "Two Factor Authentication",
        description: "Add an extra layer of security to your account on every login",
        type: "toggle",
        default: false
      },
      {
        icon:null,
        key: "changePassword",
        label: "Change Password",
        description: "Update your current password to keep your account secure",
        type: "action"
      },
      {
        icon:null,
        key: "activeDevices",
        label: "Active Devices",
        description: "View and manage all devices currently logged into your account",
        type: "action"
      },
      {
        icon:null,
        key: "dangerZone",
        label: "Delete Account",
        description: "Permanently delete your account and all associated data. This cannot be undone",
        type: "danger"
      }
    ]
  },
  {
    key: "notifications",
    title: "Notifications",
    icon: BellDot,
    fields: [
      {
        icon:null,
        key: "loginAlerts",
        label: "Login Notifications",
        description: "Get notified when a new device or location logs into your account",
        type: "toggle",
        channels: ["email", "webpush"],
        default: { email: true, webpush: true }
      },
      {
        icon:null,
        key: "newProducts",
        label: "New Product Alerts",
        description: "Stay updated when new products are added to the store",
        type: "toggle",
        channels: ["email", "webpush"],
        default: { email: false, webpush: true }
      },
      {
        icon:null,
        key: "orderUpdates",
        label: "Order Updates",
        description: "Receive updates on your order status, shipping and delivery",
        type: "toggle",
        channels: ["email", "webpush"],
        default: { email: true, webpush: true }
      },
      {
        icon:null,
        key: "promotions",
        label: "Promotions & Discounts",
        description: "Be the first to know about sales, deals and exclusive offers",
        type: "toggle",
        channels: ["email", "webpush"],
        default: { email: false, webpush: false }
      }
    ]
  },
  {
    key: "privacy",
    title: "Privacy",
    icon: Shield,
    fields: [
      {
        icon:null,
        key: "exportData",
        label: "Export Data",
        description: "You can export your account data and it is fully protected",
        type: "action"
      },
    ]
  },
  {
    key: "billing",
    title: "Billing",
    icon:WalletCards,
    fields: [
      {
        icon:null,
        key: "invoiceEmail",
        label: "Send Invoices To",
        description: "Order receipts and invoices will be delivered to this email address",
        type: "email",
        default: ""
      }
    ]
  }
]