import { API_URL } from "@/context/auth_provider";
import { HelpCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${API_URL}/_/faqs`);
        const data: FaqItem[] = await response.json();
        setFaqs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFaqs();
  }, []);
  // Group faqs by type
  const groupedFaqs = useMemo(() => {
    return faqs.reduce((acc: Record<string, FaqItem[]>, faq) => {
      if (!acc[faq.type]) {
        acc[faq.type] = [];
      }
      acc[faq.type].push(faq);
      return acc;
    }, {} as Record<string, FaqItem[]>);
  }, [faqs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Find quick answers to your questions about Alora. From account
                setup to advanced features, we've got you covered.
              </p>
            </div>

            {/* Right side - Illustration */}
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <HelpCircle className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm">FAQ Illustration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find the Answers You Need
            </h2>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* {error && <div className="text-red-600 mt-4 text-sm">{error}</div>} */}
          </div>
        </div>
      </div>
      {/* FAQ Content */}
      <div className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(groupedFaqs).map(([type, questions]) => (
            <div key={type} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{capitalizeFirstLetter(type)} Questions</h3>
              <Card className="shadow-lg border-0">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((questionItem) => (
                      <AccordionItem
                        key={questionItem._id || questionItem.question}
                        value={questionItem.question}
                      >
                        <AccordionTrigger className="p-4">
                          {questionItem.question}
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                          {questionItem.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default FaqPage;
