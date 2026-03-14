export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    speed: 10,
    download: 'up to 10 Mbps',
    price: 'KES 1,500',
    features: ['Unlimited data', 'Standard support', 'Ideal for small households'],
    bestValue: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    speed: 20,
    download: 'up to 20 Mbps',
    price: 'KES 2,000',
    features: ['Unlimited data', 'Priority support', 'Great for streaming'],
    bestValue: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    speed: 50,
    download: 'up to 50 Mbps',
    price: 'KES 3,000',
    features: ['Unlimited data', 'Priority support', 'Gaming-ready performance'],
    bestValue: true,
  },
  {
    id: 'business',
    name: 'Business',
    speed: 100,
    download: 'up to 100 Mbps',
    price: 'KES 7,000',
    features: ['Unlimited data', 'Dedicated support', 'Designed for businesses'],
    bestValue: false,
  },
]

export function getPlanById(id) {
  return plans.find((plan) => plan.id === id) ?? plans[0]
}
