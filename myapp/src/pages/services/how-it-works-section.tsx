import { Card, CardContent } from "../../components/ui/card";
import { ClipboardCheck, Users, MessageCircle } from "lucide-react";

const howItWorksSteps = [
  {
    step: "1",
    title: "Choose Your Service",
    description:
      "Select the home service you need from our wide range of professional offerings.",
  },
  {
    step: "2",
    title: "Schedule a Professional",
    description:
      "Connect with qualified and vetted professionals who are available at your convenience.",
  },
  {
    step: "3",
    title: "Relax & Enjoy",
    description:
      "Our professional handles the service while you can focus on what matters most to you.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Alora Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={step.step} className="text-center">
              <div className="relative mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  {step.step}
                </div>
                {/* Icons for each step */}
                <div className="mt-4">
                  {index === 0 && (
                    <ClipboardCheck
                      className="mx-auto text-gray-400"
                      size={32}
                    />
                  )}
                  {index === 1 && (
                    <Users className="mx-auto text-gray-400" size={32} />
                  )}
                  {index === 2 && (
                    <MessageCircle
                      className="mx-auto text-gray-400"
                      size={32}
                    />
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
