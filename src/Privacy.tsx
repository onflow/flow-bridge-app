import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <header className="bg-background p-4 sticky top-0 z-10">
        <Link to="/" className="text-xl font-bold">← Back</Link>
      </header>
      
      <main className="flex-grow p-6 max-w-3xl mx-auto bg-background">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="mb-4"><strong>Last Updated: August 28, 2024</strong></p>

        <p className="mb-4">
          Flow Foundation ("Flow", "we" or "us") is committed to protecting your privacy
          and safeguarding your personal information. The purpose of this privacy
          policy is to inform you about how we collect, use and disclose personal
          information when you interact with our website bridge.flow.com (the "Site")
          and with our products and services (the "Services"). This privacy policy relates
          to all of our activities, unless we have provided you with a separate privacy
          policy for a particular product, service or activity.
        </p>

        <p className="mb-4">
          Please review this privacy policy carefully. By submitting your personal
          information to us, by using our Site, or by otherwise accessing or using the
          Services, you consent to our collecting, using and disclosing your personal
          information as set out in this privacy policy.
        </p>

        <p className="mb-4">
          If you provide personal information about another individual to us, it is your 
          responsibility to obtain the consent of that individual to enable us to collect 
          such information from you, and to use and disclose his or her information as 
          described in this privacy policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Meaning of Personal Information</h2>

        <p className="mb-4">
          "Personal information" means information about an identifiable individual.  
          This information may include, but is not limited to, your name, mailing 
          address, e-mail address, telephone number and country of residence.
        </p>

        <p className="mb-4">
          Personal information does not include information where there is no serious 
          possibility that it can be used to identify an individual, whether on its own or 
          in combination with other information, or personal information that has been 
          anonymized or aggregated such as to be considered anonymized information
          or no longer personal information under applicable laws.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Your Consent to Collection, Use and Disclosure</h2>

        <p className="mb-4">
          The primary basis on which we collect, use and disclose your personal 
          information is with your consent, unless otherwise permitted or required by 
          law. How we obtain your consent will depend on the circumstances, as well 
          as the sensitivity of the information collected. Subject to applicable laws, 
          your consent may be express or implied, depending on the circumstances 
          and the sensitivity of the personal information in question. If you choose to 
          provide personal information to us, we assume that you consent to the 
          collection, use and disclosure of your personal information as outlined in this 
          privacy policy.
        </p>

        <p className="mb-4">
          Typically, we will seek your consent at the time your personal information is 
          collected. Where we want to use your personal information for a purpose not 
          previously identified to you at the time of collection, we will seek your 
          consent prior to our use of such information for this new purpose.
        </p>

        <p className="mb-4">
          You may withdraw your consent to our collection, use or disclosure of your 
          personal information at any time by contacting us using the contact 
          information within our Site. However, before we implement the withdrawal 
          of consent, we may require proof of your identity. In some cases, withdrawal 
          of your consent may mean that we will no longer be able to provide certain 
          products or services. Please also note that certain data will remain within the
          Services for us to fulfill its contractual obligations, even after you withdraw 
          your consent.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Our Collection of Personal Information</h2>

        <h3 className="text-xl font-bold mt-4 mb-2">How we collect Personal Information</h3>

        <p className="mb-4">
          We collect Personal Information from you in the following ways:
        </p>

        <ul className="list-disc pl-6 mb-4">
          <li>Through your use of the Services, whether directly uploaded and 
            created by you, or automatically collected by us as you use the 
            Services.</li>
          <li>Through your engagement with our Site, including information 
            submitted by you within a Site form or obtained from us through 
            cookies or similar technologies.</li>
          <li>From third party sources, such as technology partners and service 
            providers.</li>
        </ul>

        <h3 className="text-xl font-bold mt-4 mb-2">Types of Personal Information we collect</h3>

        <p className="mb-4">
          We may collect, use, and disclose different types of personal information, 
          depending on our relationship with you. Generally, we collect the following 
          types of personal information (not all of which may apply to you):
        </p>

        <ul className="list-disc pl-6 mb-4">
          <li>When you engage in a transaction or exchange tokens within the 
            Services, we may collect details of your blockchain address, digital 
            wallet, digital assets or Distributed Ledger Technology transactions.</li>
          <li>We may receive information about you when you integrate or link a 
            third-party service with our Services or Site, such as when you link a 
            digital wallet. You may also integrate our Services with other services 
            you use, so as to allow you to access, store, share and edit certain 
            content from a third-party through our Services. The information we 
            receive when you link or integrate our Services with a third-party 
            service depends on the settings, permissions and privacy policy 
            controlled by that third-party service. You should always check the 
            privacy settings and notices in these third-party services to understand
            what data may be disclosed to us or shared with our Services.</li>
          <li>We collect usage information relating to your use of the Services and 
            how you interact with our Site. Such information may include your 
            Internet protocol address, information about your device, browser and 
            operating system, how you are using our Services, and the date and 
            time of your visit.</li>
          <li>Site Forms: We may collect information that you submit to us on our 
            Site, including your name, e-mail address and other contact 
            information.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4">Cookie Policy</h2>

        <p className="mb-4">
          We use "cookies" and enlist third party services which use cookies to track 
          your preferences and activities on our Site and within our Services. Cookies 
          are small data files transferred to your computer's hard-drive by a website.  
          They keep a record of your preferences and login information, making your 
          subsequent visits to the Site and Services more efficient and secure. Cookies
          may store a variety of information, including the number of times that you 
          access a website, your login information, your device information, IP address,
          and the number of times that you view a particular page or other item on the
          Site or Services. The use of cookies is a common practice adopted by most 
          major websites to better serve their users.   You have a variety of tools to 
          control the information collected by cookies, web beacons, and similar 
          technologies when you use our Site. For example, you can use controls in 
          your internet browser to limit how the websites you visit are able to use 
          cookies and to withdraw your consent by clearing or blocking cookies. You 
          should note, however, that without cookies some of our website's functions 
          may not be available.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">How We Use Your Personal Information</h2>

        <p className="mb-4">
          We may use your personal information and other information that we collect 
          to provide the Services, to comply with our contractual obligations, and to 
          support our legitimate interests in maintaining, improving and advertising 
          the Services. Below are the specific purposes for which we use the 
          information we collect about you.
        </p>

        <ul className="list-disc pl-6 mb-4">
          <li>to determine your eligibility for our services in accordance with 
            applicable laws and our policies;</li>
          <li>to monitor, maintain, and improve our Services, and to develop new 
            products and services;</li>
          <li>to respond to inquiries and other requests;</li>
          <li>to manage our business and our arrangements with our clients, 
            including to detect and prevent errors and fraud;</li>
          <li>to comply with legal and regulatory requirements, where applicable.</li>
        </ul>

        <p className="mb-4">
          We may use your personal information and other information for purposes 
          for which we have obtained your consent, and for such other purposes as 
          may be permitted or required by applicable law.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">How We Share Your Personal Information</h2>

        <h3 className="text-xl font-bold mt-4 mb-2">Sharing with Third Parties</h3>

        <p className="mb-4">
          We share your personal information with third party service providers who 
          perform some functionality within the Site and Services on our behalf, such 
          as digital wallet providers and blockchain providers. We also share your 
          information with third party service providers who provide products and 
          services that we use to operate our business, such as Axelar.
        </p>

        <p className="mb-4">
          If we provide your information to service providers for our provision of the 
          Services, then we require that service providers maintain the confidentiality 
          of your personal information and keep your personal information secure. We 
          also require that they only use your personal information for the limited 
          purposes for which it is provided. When our service providers no longer need 
          your personal information for those limited purposes, we require that they 
          dispose of the personal information. In some circumstances, we may permit 
          our service providers to retain anonymized or statistical information that 
          does not identify you. We do not authorize the service providers to disclose 
          your personal information to unauthorized parties or to use your personal 
          information for their direct marketing purposes. If you would like more 
          information about our service providers, please contact us using the contact 
          information on our Site.
        </p>

        <h3 className="text-xl font-bold mt-4 mb-2">Other Disclosures</h3>

        <p className="mb-4">
          Additionally, we may disclose your information when we believe such 
          disclosure is permitted, necessary or appropriate: (a) under applicable law, 
          including laws outside your country of residence; (b) to comply with legal 
          process; (c) to respond to requests from public and government authorities, 
          including public and government authorities outside your country of 
          residence; (d) to enforce the terms of the agreements for our products and 
          services; (e) to protect our operations or those of any of our affiliates or 
          subsidiaries; (f) to protect our rights, privacy, safety or property, and/or 
          those of our affiliates, you or others; and (g) to allow us to pursue available 
          remedies or limit the damages that we may sustain. In addition, we may 
          transfer your personal information and other information to a third party in 
          the event of any reorganization, merger, sale, joint venture, assignment, 
          transfer or other disposition of all or any portion of our business, brands, 
          affiliates, subsidiaries or other assets.
        </p>

        <p className="mb-4">
          If we otherwise intend to disclose your personal information to a third party, 
          we will identify that third party and the purpose for the disclosure and obtain
          your consent.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Retention, Storage, and International Transfer of Personal 
          Information</h2>

        <p className="mb-4">
          We will retain your personal information for as long as necessary to fulfill the 
          purposes for which we collected it, and as permitted or required by law.
        </p>

        <p className="mb-4">
          We may transfer your personal information outside of Canada to fulfil the 
          purpose for which we collected it, including for processing and storage by 
          service providers. While your personal information is outside of Canada, it is 
          subject to the laws of the country in which it is located, which may have 
          different data protection laws than Canada. Those laws may require 
          disclosure of your personal information to authorities in that country. For 
          more information about our policies and practices regarding service 
          providers outside of Canada, contact us using the contact information in the 
          "How to Contact Us" section below.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Security of Personal Information</h2>

        <p className="mb-4">
          We have implemented commercially reasonable physical, organizational, 
          contractual and technological security measures with a view to protecting 
          your personal information from accidental or unlawful destruction, loss or 
          theft, unauthorized access, disclosure, copying, use or modification.  We 
          have taken steps to ensure that the only personnel who are granted access 
          to your personal information are those with a business 'need-to-know' or 
          whose duties reasonably require such information.
        </p>

        <p className="mb-4">
          Despite the measures outlined above, no method of information transmission
          or information storage is 100% secure or error-free, so we unfortunately 
          cannot guarantee absolute security. In the case of a breach of security 
          safeguards, we will act promptly to mitigate the risks and to inform you 
          where there is a real risk of significant harm, or as otherwise required by law.
        </p>

        <p className="mb-4">
          You are responsible for maintaining the secrecy of your identification, 
          passwords and/or any personal information in your possession for the use of 
          our Site and/or the Services. Always be careful and responsible regarding 
          your personal information. We are not responsible for, and cannot control, 
          the use by others of any information which you provide to them and you 
          should use caution in selecting the personal information you provide to 
          others through our Site or the Services. Similarly, we cannot assume any 
          responsibility for the content of any personal information or other 
          information which you receive from other users through our Site or the 
          Services. We cannot guarantee, or assume any responsibility for verifying, 
          the accuracy of the personal information or other information provided by 
          any third party.
        </p>

        <p className="mb-4">
          If you have reason to believe that your interaction with us is no longer secure
          (for example, if you feel that the security of any information that you 
          provided to us has been compromised), please contact us immediately using 
          the contact information on our Site.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Your Rights Regarding Your Personal Information</h2>

        <p className="mb-4">
          Individuals have a number of rights concerning their personal information 
          under global privacy laws. You may make a written request to access, 
          correct or delete any personal information about you that we have collected, 
          used or disclosed, and we will provide you with any such personal 
          information to the extent required by law. You may also challenge the 
          accuracy or completeness of your personal information in our records. If you 
          successfully demonstrate that your personal information in our records is 
          inaccurate or incomplete, we will amend the personal information as 
          required.
        </p>

        <p className="mb-4">
          Where applicable, you may be entitled to additional rights, including: (i) the 
          right to withdraw consent to processing; (ii) the right to object to unlawful 
          data processing, under certain conditions; (iii) the right to erasure of 
          personal information about you, under certain conditions; (iv) the right to 
          demand that we restrict processing of your personal information, under 
          certain conditions, if you believe we have exceeded the legitimate basis for 
          processing, processing is no longer necessary, or believe your personal 
          information is inaccurate; (v) the right to data portability of personal 
          information concerning you that you provided us in a structured, commonly 
          used, and machine-readable format, under certain conditions; (vi) the right 
          to object to decisions being taken by automated means which produce legal 
          effects concerning you or similarly significantly affect you, under certain 
          conditions.
        </p>

        <p className="mb-4">
          Please note that such rights are not absolute. There are instances where 
          applicable law or regulatory requirements allow or require us to refuse to 
          provide some or all of the personal data that we hold about you. In the event
          that we cannot accommodate your request, we will inform you of the reasons
          why, subject to any legal or regulatory restrictions.
        </p>

        <p className="mb-4">
          When you exercise your right to deletion of your personal information, we 
          will delete your personal information, subject to some instances where your 
          personal information will be maintained for us to fulfill our obligations under 
          contract.
        </p>

        <p className="mb-4">
          You also have the right to lodge a complaint with the relevant data 
          protection or privacy authority, such as the Office of the Privacy 
          Commissioner.
        </p>

        <p className="mb-4">
          We may require that you provide sufficient identification to fulfill your 
          request to access or correct your personal information. Any such identifying 
          information will be used only for this purpose. We will not charge you any 
          fees to access your personal information in our records without first 
          providing you with an estimate of the approximate fees, if any.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Third Party Websites and Services</h2>

        <p className="mb-4">
          We may provide links to third-party websites for your convenience and 
          information. We may also make opportunities available to you to purchase, 
          subscribe to, or use other products or services from third parties with 
          different privacy practices. Those other websites, products, or services are 
          governed by the privacy statements and policies of the respective third 
          party. This Privacy Statement does not extend to any websites, products, or 
          services provided by third parties. We do not assume responsibility for the 
          privacy practices of third parties and we encourage you to review all third-
          party privacy statements prior to using third-party websites, products, or 
          services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Privacy Policy Updates</h2>

        <p className="mb-4">
          This privacy policy is current as of the "updated" date which appears at the 
          top of this page. We may modify this privacy policy from time to time.  
          When changes are made to this privacy policy they will become immediately 
          effective when published in a revised privacy policy posted on our Site, 
          unless otherwise noted. We may also communicate the changes through our
          Services or by other means. By submitting your personal information to us, 
          by registering for or using any of the Services we offer, by using our Site, or 
          by voluntarily interacting with us after we publish or communicate a notice 
          about the changes to this privacy policy, you consent to our collecting, using 
          and disclosing your personal information as set out in the revised privacy 
          policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Contact Us</h2>

        <p className="mb-4">
          All comments, questions, concerns or complaints regarding your personal 
          information or our privacy practices should be sent to our Privacy Officer at 
          the following email address: support@flow.com.
        </p>
      </main>

      <footer className="bg-background p-4 text-center">
        <p>328944.00003/308683034.1</p>
      </footer>
    </div>
  );
};

export default Privacy;
