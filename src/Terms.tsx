import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <header className="bg-background p-4 sticky top-0 z-10">
        <Link to="/" className="text-xl font-bold">← Back</Link>
      </header>
      
      <div className="flex-grow overflow-y-auto">
        <main className="p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="mb-4">Last Updated: August 28, 2024</p>

          <section className="mb-8">
            <p className="mb-4">
              These Terms of Service (this &quot;Agreement&quot;) set forth the terms and conditions that apply
              to your access and use of the internet website located at bridge.flow.com (the &quot;Site&quot;),
              owned and operated by Flow Foundation (&quot;Flow&quot;, &quot;we&quot;, &quot;our&quot; or &quot;us&quot;), and the
              products, services, content, applications and features available thereon (collectively, the
              &quot;Services&quot;).
            </p>

            <p className="mb-4 font-bold">
              BY ACCESSING OR USING THE SITE OR SERVICES OR CLICKING ON THE &quot;I ACCEPT&quot; OR
              SIMILAR BUTTON, YOU ARE INDICATING YOUR ACCEPTANCE TO BE BOUND BY THIS
              AGREEMENT. IF YOU DO NOT ACCEPT THIS AGREEMENT, YOU MUST NOT ACCESS OR USE
              THE SITE OR THE SERVICES. IF YOU ARE DISSATISFIED WITH THIS AGREEMENT OR ANY
              RULES, POLICIES, GUIDELINES OR PRACTICES APPLICABLE TO THE SITE OR SERVICES,
              YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SITE AND
              SERVICES.
            </p>

            <p className="mb-4 font-bold">
              IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY OR OTHER
              LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH ENTITY
              TO THESE TERMS AND CONDITIONS, IN WHICH CASE THE TERMS &quot;YOU&quot; OR &quot;YOUR&quot; WILL
              REFER TO SUCH ENTITY. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT
              AGREE WITH THESE TERMS AND CONDITIONS, YOU MUST NOT ACCEPT THIS AGREEMENT
              AND MAY NOT USE THE SERVICES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Agreement and Privacy Policy</h2>
            <p className="mb-4">
              By accepting this Agreement, you agree to be bound by the terms and conditions of this
              Agreement, as well as Flow&apos;s Privacy Policy located at bridge.flow.com/privacy (the
              &quot;Privacy Policy&quot;), as it may be amended from time to time in the future.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amendments</h2>
            <p className="mb-4">
              We may amend any part of this Agreement by adding, deleting, or varying its terms from
              time-to-time in our discretion. We will provide you with notice of the proposed
              amendment by posting an amended version of this Agreement with a new &quot;Last
              Updated&quot; date. We will include a link to the previous version of the terms beneath the
              new &quot;Last Updated&quot; date.
            </p>
            <p className="mb-4">
              The amendments will take effect 30 days after the date on which we provide notice of
              the amended version. Prior to that date, the previous version of this Agreement will
              continue to apply.
            </p>
            <p className="mb-4">
              If you disagree with any amendments, you may terminate this Agreement by ceasing to
              use the Site and Services at any time within the 30-day period before the amendments
              take effect. If the amendment increases your obligations under this Agreement, or
              decreases our obligations under this Agreement, then you can also terminate in the 30
              days after the amendments take effect. In either case, there is no cost or penalty for
              terminating. If you do not cease using the Site and Services during that time, then by
              your continued use, you are considered to have accepted the proposed amendments.
            </p>
          </section>

          {/* Add more sections as needed */}

        </main>
      </div>

      <footer className="bg-background p-4 text-center">
        <p>328944.00003/308683131.1</p>
      </footer>
    </div>
  );
};

export default Terms;