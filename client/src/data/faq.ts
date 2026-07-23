export type FaqItem = {
  question: string
  answer: string
}

export type FaqCategory = {
  title: string
  items: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 3–7 business days across India. Express delivery (1–3 days) is available in metro cities. You will receive tracking details once your order ships.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'We currently ship within India only. International shipping is planned for a future launch — join our newsletter to be notified.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once shipped, you will receive an email and SMS with a tracking link. You can also view order status in your account under Order History.',
      },
      {
        question: 'What are the shipping charges?',
        answer:
          'Free shipping on orders above ₹999. Below that, a flat ₹79 shipping fee applies. Express delivery incurs an additional ₹149.',
      },
    ],
  },
  {
    title: 'Products & Ingredients',
    items: [
      {
        question: 'Are your products cruelty-free?',
        answer:
          'Yes. Aura of Nature is 100% cruelty-free. We never test on animals and do not sell in markets that require animal testing.',
      },
      {
        question: 'Are products suitable for sensitive skin?',
        answer:
          'Many of our formulas are designed for sensitive skin, but we recommend patch testing any new product on your inner arm before full application. Check individual product pages for skin type guidance.',
      },
      {
        question: 'What is the shelf life of your products?',
        answer:
          'Unopened products typically last 18–24 months. Once opened, use within 6–12 months depending on the product. Each label shows a best-before date.',
      },
      {
        question: 'Do you use synthetic fragrances?',
        answer:
          'No. All scents come from essential oils and natural botanical extracts. We never use synthetic parfum or artificial colourants.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'Unopened products in original packaging may be returned within 15 days of delivery for a full refund. Opened products cannot be returned for hygiene reasons unless defective.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Email support@auraofnature.com with your order number and reason for return. We will provide a prepaid return label within 24 hours.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refunds are processed within 5–7 business days after we receive the returned item. The amount is credited to your original payment method.',
      },
    ],
  },
  {
    title: 'Account & Payments',
    items: [
      {
        question: 'Which payment methods do you accept?',
        answer:
          'We accept UPI, credit/debit cards, net banking, and wallets via Razorpay. Cash on delivery is available for orders under ₹5,000.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes. All payments are processed through Razorpay\'s PCI-DSS compliant gateway. We never store card details on our servers.',
      },
      {
        question: 'Can I change or cancel my order?',
        answer:
          'Orders can be modified or cancelled within 2 hours of placement. After that, contact us immediately — we will try to help if the order has not yet shipped.',
      },
    ],
  },
]

export const faqHero = {
  eyebrow: 'Help centre',
  title: 'Frequently asked questions',
  description:
    'Everything you need to know about orders, products, returns, and your Aura account.',
}
