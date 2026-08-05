export type PolicySection = {
  id?: string
  heading: string
  paragraphs: string[]
  list?: string[]
}

export type PolicyDocument = {
  title: string
  lastUpdated: string
  intro: string
  sections: PolicySection[]
}

export const privacyPolicy: PolicyDocument = {
  title: 'Privacy Policy',
  lastUpdated: 'January 2026',
  intro:
    'Aura of Nature ("we", "us", "our") respects your privacy. This policy explains how we collect, use, and protect your personal information when you visit our website or make a purchase.',
  sections: [
    {
      heading: 'Information we collect',
      paragraphs: [
        'When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment information (processed securely via Razorpay — we do not store card details).',
        'We also collect usage data such as pages visited, device type, and browser information through cookies and analytics tools to improve our website.',
      ],
    },
    {
      heading: 'How we use your information',
      paragraphs: ['We use your information to:'],
      list: [
        'Process and fulfil orders',
        'Send order confirmations and shipping updates',
        'Respond to customer service requests',
        'Send marketing communications (only with your consent)',
        'Improve our website and product offerings',
        'Comply with legal obligations',
      ],
    },
    {
      heading: 'Sharing your information',
      paragraphs: [
        'We do not sell your personal data. We share information only with trusted service providers who help us operate our business — payment processors, shipping partners, and email service providers — under strict confidentiality agreements.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@auraofnature.com. You can unsubscribe from marketing emails using the link in any newsletter.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'For privacy-related questions, contact us at privacy@auraofnature.com or write to Aura of Nature, Bengaluru, Karnataka, India.',
      ],
    },
  ],
}

export const termsOfService: PolicyDocument = {
  title: 'Terms of Service',
  lastUpdated: 'January 2026',
  intro:
    'By accessing or using the Aura of Nature website, you agree to these Terms of Service. Please read them carefully before making a purchase.',
  sections: [
    {
      heading: 'Use of the website',
      paragraphs: [
        'You must be at least 18 years old to make a purchase. You agree to provide accurate information and not use the site for any unlawful purpose.',
      ],
    },
    {
      heading: 'Products and pricing',
      paragraphs: [
        'We strive to display accurate product descriptions and prices. We reserve the right to correct errors and to modify or discontinue products without notice. Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
      ],
    },
    {
      heading: 'Orders and payment',
      paragraphs: [
        'Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel orders at our discretion. Payment must be received before dispatch.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'All content on this website — text, images, logos, and design — is owned by Aura of Nature and protected by copyright law. You may not reproduce or distribute our content without written permission.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'Aura of Nature is not liable for indirect, incidental, or consequential damages arising from use of our products or website. Our total liability is limited to the amount you paid for the product in question.',
      ],
    },
  ],
}

export const returnPolicy: PolicyDocument = {
  title: 'Return & Refund Policy',
  lastUpdated: 'January 2026',
  intro:
    'We want you to love every Aura product. If something is not right, here is how returns and refunds work.',
  sections: [
    {
      heading: 'Return window',
      paragraphs: [
        'Unopened products in original, undamaged packaging may be returned within 15 days of delivery for a full refund or exchange.',
      ],
    },
    {
      heading: 'Non-returnable items',
      paragraphs: ['The following cannot be returned:'],
      list: [
        'Opened or used products (unless defective)',
        'Products without original packaging',
        'Gift cards and promotional items',
        'Products purchased during final sale events',
      ],
    },
    {
      heading: 'Defective or damaged products',
      paragraphs: [
        'If you receive a damaged or defective item, contact us within 48 hours with photos. We will arrange a free replacement or full refund — no return shipping required.',
      ],
    },
    {
      heading: 'How to return',
      paragraphs: [
        'Email support@auraofnature.com with your order number and reason for return. We will send a prepaid return label within 24 hours. Pack items securely and drop off at the nearest courier point.',
      ],
    },
    {
      heading: 'Refund timeline',
      paragraphs: [
        'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited to your original payment method.',
      ],
    },
  ],
}

export const shippingPolicy: PolicyDocument = {
  title: 'Shipping Policy',
  lastUpdated: 'January 2026',
  intro:
    'We ship across India from our studio in Bengaluru. Here is everything you need to know about delivery times and costs.',
  sections: [
    {
      id: 'delivery-times',
      heading: 'Delivery times',
      paragraphs: ['Estimated delivery times by region:'],
      list: [
        'Metro cities: 2–4 business days',
        'Tier 2 cities: 3–5 business days',
        'Remote areas: 5–7 business days',
        'Express delivery (select metros): 1–2 business days',
      ],
    },
    {
      id: 'shipping-costs',
      heading: 'Shipping costs',
      paragraphs: [
        'Free standard shipping on orders above ₹999. Orders below ₹999 incur a flat ₹79 shipping fee. Express delivery adds ₹149 to any order.',
      ],
    },
    {
      id: 'order-processing',
      heading: 'Order processing',
      paragraphs: [
        'Orders placed before 2 PM IST on business days are typically dispatched the same day. Orders placed after 2 PM or on weekends/holidays ship the next business day.',
      ],
    },
    {
      id: 'tracking',
      heading: 'Tracking',
      paragraphs: [
        'You will receive an email and SMS with tracking details once your order ships. Track your order anytime from your account dashboard.',
      ],
    },
    {
      id: 'delivery-issues',
      heading: 'Delivery issues',
      paragraphs: [
        'If your package is lost or significantly delayed, contact support@auraofnature.com. We will investigate with our courier partner and arrange a replacement or refund if necessary.',
      ],
    },
  ],
}
