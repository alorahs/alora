import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Introduction
              </h2>
              <p className="text-muted-foreground">
                These terms and conditions outline the rules and regulations for
                the use of Alora's Website, located at [website URL].
              </p>
              <p className="text-muted-foreground mt-4">
                By accessing this website we assume you accept these terms and
                conditions. Do not continue to use Alora if you do not agree to
                take all of the terms and conditions stated on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                Unless otherwise stated, Alora and/or its licensors own the
                intellectual property rights for all material on Alora. All
                intellectual property rights are reserved. You may access this
                from Alora for your own personal use subjected to restrictions
                set in these terms and conditions.
              </p>
              <p className="text-muted-foreground mt-4">You must not:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Republish material from Alora</li>
                <li>Sell, rent or sub-license material from Alora</li>
                <li>Reproduce, duplicate or copy material from Alora</li>
                <li>Redistribute content from Alora</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                User Responsibilities
              </h2>
              <p className="text-muted-foreground">
                As a user of Alora, you agree to the following:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>
                  You must provide accurate and complete registration
                  information
                </li>
                <li>
                  You must maintain the security of your account and password
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account
                </li>
                <li>
                  You are responsible for all activities that occur under your
                  account
                </li>
                <li>
                  You must not use Alora for any illegal or unauthorized purpose
                </li>
                <li>
                  You must not transmit any worms or viruses or any code of a
                  destructive nature
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Service Description
              </h2>
              <p className="text-muted-foreground">
                Alora provides a platform that connects users with service
                professionals. We do not provide the services ourselves, but
                rather facilitate connections between users and professionals.
              </p>
              <p className="text-muted-foreground mt-4">
                We reserve the right to modify or discontinue, temporarily or
                permanently, the service (or any part thereof) with or without
                notice. We shall not be liable to you or to any third party for
                any modification, price change, suspension or discontinuance of
                the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Payments and Fees
              </h2>
              <p className="text-muted-foreground">
                All payments for services booked through Alora are processed
                through our payment partners. You agree to pay all fees and
                charges associated with your account on a timely basis.
              </p>
              <p className="text-muted-foreground mt-4">
                Prices for services are subject to change without notice. We may
                change our fees and charges at any time. Any changes will be
                posted on the website and will take effect immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                In no event shall Alora, nor its directors, employees, partners,
                agents, suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>
                  Your access to or use of or inability to access or use the
                  service
                </li>
                <li>
                  Any conduct or content of any third party on the service
                </li>
                <li>Any content obtained from the service</li>
                <li>
                  Unauthorized access, use or alteration of your transmissions
                  or content
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Termination
              </h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-muted-foreground mt-4">
                If you wish to terminate your account, you may simply
                discontinue using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Governing Law
              </h2>
              <p className="text-muted-foreground">
                These Terms shall be governed and construed in accordance with
                the laws of [Country/State], without regard to its conflict of
                law provisions.
              </p>
              <p className="text-muted-foreground mt-4">
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any
                provision of these Terms is held to be invalid or unenforceable
                by a court, the remaining provisions of these Terms will remain
                in effect. These Terms constitute the entire agreement between
                us regarding our Service, and supersede and replace any prior
                agreements we might have had between us regarding the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Changes to These Terms
              </h2>
              <p className="text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p className="text-muted-foreground mt-4">
                By continuing to access or use our Service after any revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, you are no longer authorized
                to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Email: terms@alora.com</li>
                <li>Address: [Company Address]</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
