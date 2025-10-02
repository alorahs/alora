import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">
              Cookie Policy
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
                What Are Cookies
              </h2>
              <p className="text-muted-foreground">
                As is common practice with almost all professional websites this
                site uses cookies, which are tiny files that are downloaded to
                your computer, to improve your experience. This page describes
                what information they gather, how we use it and why we sometimes
                need to store these cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How We Use Cookies
              </h2>
              <p className="text-muted-foreground">
                We use cookies for a variety of reasons detailed below.
                Unfortunately in most cases there are no industry standard
                options for disabling cookies without completely disabling the
                functionality and features they add to this site. It is
                recommended that you leave on all cookies if you are not sure
                whether you need them or not in case they are used to provide a
                service that you use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Disabling Cookies
              </h2>
              <p className="text-muted-foreground">
                You can prevent the setting of cookies by adjusting the settings
                on your browser (see your browser Help for how to do this). Be
                aware that disabling cookies will affect the functionality of
                this and many other websites that you visit. Disabling cookies
                will usually result in also disabling certain functionality and
                features of the this site. Therefore it is recommended that you
                do not disable cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                The Cookies We Set
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                Account related cookies
              </h3>
              <p className="text-muted-foreground">
                If you create an account with us then we will use cookies for
                the management of the signup process and general administration.
                These cookies will usually be deleted when you log out however
                in some cases they may remain afterwards to remember your site
                preferences when logged out.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                Login related cookies
              </h3>
              <p className="text-muted-foreground">
                We use cookies when you are logged in so that we can remember
                this fact. This prevents you from having to log in every single
                time you visit a new page. These cookies are typically removed
                or cleared when you log out to ensure that you can only access
                restricted features and areas when logged in.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                Site preferences cookies
              </h3>
              <p className="text-muted-foreground">
                In order to provide you with a great experience on this site we
                provide the functionality to set your preferences for how this
                site runs when you use it. In order to remember your preferences
                we need to set cookies so that this information can be called
                whenever you interact with a page is affected by your
                preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Third Party Cookies
              </h2>
              <p className="text-muted-foreground">
                In some special cases we also use cookies provided by trusted
                third parties. The following section details which third party
                cookies you might encounter through this site.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                Google Analytics
              </h3>
              <p className="text-muted-foreground">
                This site uses Google Analytics which is one of the most
                widespread and trusted analytics solution on the web for helping
                us to understand how you use the site and ways that we can
                improve your experience. These cookies may track things such as
                how long you spend on the site and the pages that you visit so
                we can continue to produce engaging content.
              </p>
              <p className="text-muted-foreground mt-2">
                For more information on Google Analytics cookies, see the
                official Google Analytics page.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                Social Media
              </h3>
              <p className="text-muted-foreground">
                Our site may include social media features, such as the
                Facebook, Twitter, and LinkedIn share buttons. These features
                may collect your IP address, which page you are visiting on our
                site, and may set a cookie to enable the feature to function
                properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                More Information
              </h2>
              <p className="text-muted-foreground">
                Hopefully that has clarified things for you and as was
                previously mentioned if there is something that you aren't sure
                whether you need or not it's usually safer to leave cookies
                enabled in case it does interact with one of the features you
                use on our site.
              </p>
              <p className="text-muted-foreground mt-4">
                However if you are still looking for more information then you
                can contact us through one of our preferred contact methods:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Email: privacy@alora.com</li>
                <li>By visiting this link: [Contact Page URL]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. We will
                notify you of any changes by posting the new Cookie Policy on
                this page. You are advised to review this Cookie Policy
                periodically for any changes.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
