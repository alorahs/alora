import { Button } from "../../components/ui/button";

export default function FinalCTASection({
  onGetQuote,
}: {
  onGetQuote: () => void;
}) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Home?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Experience the convenience and quality of Alora's professional home
          services. Get started today!
        </p>
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
          onClick={onGetQuote}
        >
          Get a Free Quote
        </Button>
      </div>
    </section>
  );
}
