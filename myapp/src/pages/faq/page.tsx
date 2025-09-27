import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, Phone, Mail } from "lucide-react";
import { API_URL } from "@/context/auth_provider";

function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqData, setFaqData] = useState<Record<string, { type: string; question: string; answer: string }[]>>({});
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/_/faqs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setFaqData(await response.json());
    };
    fetchData();
  }, []);

  const filteredFAQ = Object.entries(faqData).reduce(
    (acc, [type , questions]) => {
      const filteredQuestions = questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredQuestions.length > 0) {
        acc[category] = filteredQuestions;
      }
      return acc;
    },
    {} as typeof faqData
  );

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
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(filteredFAQ).map(([category, questions]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {category}
              </h3>
              <Card className="shadow-lg border-0">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category}-${index}`}
                        className="border-gray-200 last:border-b-0"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 text-lg font-medium text-gray-900">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}

          {Object.keys(filteredFAQ).length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse our categories above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="text-center py-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                If you couldn't find the answer you were looking for, our
                support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Support
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-50 px-8 py-3"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Go Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default FaqPage;
