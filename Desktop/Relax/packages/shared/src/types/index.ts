import { z } from 'zod';

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  role: z.enum(['customer', 'merchant', 'staff']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Merchant types
export const MerchantSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessName: z.string(),
  description: z.string().optional(),
  address: z.string(),
  city: z.string(),
  phone: z.string(),
  email: z.string().email(),
  latitude: z.number(),
  longitude: z.number(),
  rating: z.number().min(0).max(5).default(0),
  totalReviews: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Merchant = z.infer<typeof MerchantSchema>;

// Service types
export const ServiceSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.number(), // in minutes
  price: z.number(),
  category: z.string(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;

// Availability Slot types
export const AvailabilitySlotSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

// Booking types
export const BookingSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  merchantId: z.string(),
  serviceId: z.string(),
  staffId: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  totalPrice: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Booking = z.infer<typeof BookingSchema>;

// Payment types
export const PaymentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  amount: z.number(),
  currency: z.string().default('QAR'),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  paymentMethod: z.string(),
  transactionId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Review types
export const ReviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  customerId: z.string(),
  merchantId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;