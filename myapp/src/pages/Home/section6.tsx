function Section6() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Get answers to common questions about our platform and services.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              question: "How do I book a service professional?",
              answer:
                "Simply search for the service you need, browse available professionals in your area, and click 'Book Now' on your preferred provider. You can schedule a time that works for you.",
            },
            {
              question: "Are all professionals background checked?",
              answer:
                "Yes, all professionals on our platform undergo thorough background checks, license verification, and insurance validation before being approved to offer services.",
            },
            {
              question: "What if I'm not satisfied with the service?",
              answer:
                "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours and we'll work to make it right, including potential refunds.",
            },
            {
              question: "How do I pay for services?",
              answer:
                "Payment is processed securely through our platform. You can pay with credit cards, debit cards, or digital wallets. Payment is only charged after the service is completed.",
            },
            {
              question: "Can I cancel or reschedule my booking?",
              answer:
                "Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled time without any fees. Last-minute changes may incur a small fee.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const content = document.getElementById(`faq-${index}`)
                  const icon = document.getElementById(`faq-icon-${index}`)
                  if (content && icon) {
                    content.classList.toggle("hidden")
                    icon.classList.toggle("rotate-180")
                  }
                }}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <svg
                  id={`faq-icon-${index}`}
                  className="h-5 w-5 text-gray-500 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div id={`faq-${index}`} className="hidden px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section6