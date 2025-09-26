import { Link } from "react-router-dom";

function FaqPage() {

    return (
        <div className="faq-page">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
                
                <div className="max-w-4xl mx-auto">
                    {/* Site Questions Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Site Questions</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
                                <h3 className="text-lg font-medium mb-2 text-indigo-600 flex items-center">
                                    <span className="mr-2">🚀</span>
                                    How do I create an account?
                                </h3>
                                <p className="text-gray-700">To create an account, click on the "Sign Up" button in the top right corner of the page and fill out the required information.</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-emerald-500">
                                <h3 className="text-lg font-medium mb-2 text-emerald-600 flex items-center">
                                    <span className="mr-2">🔑</span>
                                    How do I reset my password?
                                </h3>
                                <p className="text-gray-700">If you've forgotten your password, click on "Forgot Password" on the login page and follow the instructions sent to your email.</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-amber-500">
                                <h3 className="text-lg font-medium mb-2 text-amber-600 flex items-center">
                                    <span className="mr-2">🛡️</span>
                                    Is my personal information secure?
                                </h3>
                                <p className="text-gray-700">Yes, we use industry-standard encryption and security measures to protect your personal information.</p>
                            </div>
                        </div>
                    </section>

                    {/* General FAQ Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">General FAQ</h2>
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
                                <h3 className="text-lg font-medium mb-2 text-slate-700 flex items-center">
                                    <span className="mr-2">⭐</span>
                                    What services do you offer?
                                </h3>
                                <p className="text-gray-700">We offer a comprehensive platform with various features designed to help you manage your tasks and connect with others.</p>
                            </div>
                            
                            <div className="bg-zinc-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-zinc-200">
                                <h3 className="text-lg font-medium mb-2 text-zinc-700 flex items-center">
                                    <span className="mr-2">💬</span>
                                    How can I contact customer support?
                                </h3>
                                <p className="text-gray-700">You can reach our customer support team through the contact form on our website or by emailing support@alora.com.</p>
                            </div>
                            
                            <div className="bg-stone-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-stone-200">
                                <h3 className="text-lg font-medium mb-2 text-stone-700 flex items-center">
                                    <span className="mr-2">💰</span>
                                    Are there any fees for using the platform?
                                </h3>
                                <p className="text-gray-700">We offer both free and premium plans. Check our pricing page for detailed information about features and costs.</p>
                            </div>
                            
                            <div className="bg-neutral-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-neutral-200">
                                <h3 className="text-lg font-medium mb-2 text-neutral-700 flex items-center">
                                    <span className="mr-2">🔄</span>
                                    Can I cancel my subscription at any time?
                                </h3>
                                <p className="text-gray-700">Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center text-gray-800">
                            <span className="mr-2">🤔</span>
                            Still have questions?
                        </h2>
                        <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Feel free to reach out to our support team.</p>
                        <Link to="/contact" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <span className="mr-2">📧</span>
                            Contact Support
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}
export default FaqPage
