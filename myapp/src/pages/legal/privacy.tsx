import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">
              Privacy Policy
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
                At Alora, we respect your privacy and are committed to
                protecting your personal data. This privacy policy will inform
                you about how we look after your personal data when you visit
                our website or use our services and tell you about your privacy
                rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Important Information and Who We Are
              </h2>
              <p className="text-muted-foreground mb-4">
                Alora is the controller and responsible for your personal data.
                We have appointed a data privacy officer (DPO) who is
                responsible for overseeing questions in relation to this privacy
                policy. If you have any questions about this privacy policy,
                including any requests to exercise your legal rights, please
                contact us using the details set out below.
              </p>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Contact Details
              </h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Email address: privacy@alora.com</li>
                <li>Postal address: [Company Address]</li>
                <li>Telephone number: [Phone Number]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                The Data We Collect About You
              </h2>
              <p className="text-muted-foreground mb-4">
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Identity Data</strong> including first name, last
                  name, username or similar identifier, marital status, title,
                  date of birth and gender.
                </li>
                <li>
                  <strong>Contact Data</strong> including billing address,
                  delivery address, email address and telephone numbers.
                </li>
                <li>
                  <strong>Financial Data</strong> including bank account and
                  payment card details.
                </li>
                <li>
                  <strong>Transaction Data</strong> including details about
                  payments to and from you and other details of services you
                  have purchased from us.
                </li>
                <li>
                  <strong>Technical Data</strong> including internet protocol
                  (IP) address, your login data, browser type and version, time
                  zone setting and location, browser plug-in types and versions,
                  operating system and platform and other technology on the
                  devices you use to access this website.
                </li>
                <li>
                  <strong>Profile Data</strong> including your username and
                  password, bookings made by you, your interests, preferences,
                  feedback and survey responses.
                </li>
                <li>
                  <strong>Usage Data</strong> including information about how
                  you use our website, services and view or interact with our
                  content.
                </li>
                <li>
                  <strong>Marketing and Communications Data</strong> including
                  your preferences in receiving marketing from us and our third
                  parties and your communication preferences.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How We Collect Your Data
              </h2>
              <p className="text-muted-foreground mb-4">
                We use different methods to collect data from and about you
                including through:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Direct interactions.</strong> You may give us your
                  Identity, Contact and Financial Data by filling in forms or by
                  corresponding with us by post, phone, email or otherwise.
                </li>
                <li>
                  <strong>Automated technologies or interactions.</strong> As
                  you interact with our website, we may automatically collect
                  Technical Data about your equipment, browsing actions and
                  patterns.
                </li>
                <li>
                  <strong>Third parties or publicly available sources.</strong>{" "}
                  We may receive personal data about you from various third
                  parties and public sources.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How We Use Your Personal Data
              </h2>
              <p className="text-muted-foreground mb-4">
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  Where we need to perform the contract we are about to enter
                  into or have entered into with you.
                </li>
                <li>
                  Where we need to comply with a legal or regulatory obligation.
                </li>
                <li>
                  Where it is necessary for our legitimate interests (or those
                  of a third party) and your interests and fundamental rights do
                  not override those interests.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Data Security
              </h2>
              <p className="text-muted-foreground">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorised way, altered or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors and other third parties who have
                a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Data Retention
              </h2>
              <p className="text-muted-foreground">
                We will only retain your personal data for as long as necessary
                to fulfil the purposes we collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Your Legal Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground">
                We keep our privacy policy under regular review and place any
                updates on this web page. This version was last updated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                . It is important that the personal data we hold about you is
                accurate and current. Please keep us informed if your personal
                data changes during your relationship with us.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
