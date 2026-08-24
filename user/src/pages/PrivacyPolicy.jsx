
import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-brand-cream/10">
            <div className="site-container-prose">
                <div className="mb-10">
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-brown mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-brand-brown/50">Last updated: July 30, 2026</p>
                </div>

                <div className="space-y-8 text-sm leading-relaxed text-brand-brown/80">
                    <section>
                        <p>
                            Aarions ("we," "us," or "our") operates the aarions.in website and the
                            Aarions mobile application (together, the "Service"). This page explains
                            what information we collect, how we use it, and the choices you have.
                            By using the Service, you agree to the collection and use of information
                            in accordance with this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            1. Information We Collect
                        </h2>
                        <p className="mb-2 font-semibold">Information you provide to us:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Name, email address, and phone number when you create an account</li>
                            <li>Delivery address(es) when you place an order</li>
                            <li>Order history and items purchased</li>
                            <li>Any information you submit through our contact form</li>
                        </ul>
                        <p className="mt-3 mb-2 font-semibold">Information from third-party sign-in:</p>
                        <p>
                            If you sign in using Google, we receive your name, email address, and
                            profile photo from Google to create or match your Aarions account. We do
                            not receive your Google password.
                        </p>
                        <p className="mt-3 mb-2 font-semibold">Payment information:</p>
                        <p>
                            Payments are processed by Razorpay. We do not store your card, UPI, or
                            bank account details on our servers — these are handled directly by
                            Razorpay in accordance with their own privacy policy and security
                            standards.
                        </p>
                        <p className="mt-3 mb-2 font-semibold">Automatically collected information:</p>
                        <p>
                            We may automatically collect device type, app version, and general usage
                            data (such as pages viewed or features used) to help us maintain and
                            improve the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>To process and deliver your orders</li>
                            <li>To create and manage your account</li>
                            <li>To communicate with you about orders, offers, or support requests</li>
                            <li>To improve our products, website, and app</li>
                            <li>To detect and prevent fraud or misuse of the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            3. Sharing Your Information
                        </h2>
                        <p className="mb-2">We do not sell your personal information. We may share it with:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Delivery/logistics partners, solely to fulfill your orders</li>
                            <li>Razorpay, to process payments</li>
                            <li>Google, when you choose to sign in with Google</li>
                            <li>Law enforcement or regulators, if required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            4. Data Retention
                        </h2>
                        <p>
                            We retain your account and order information for as long as your account
                            is active, or as needed to provide the Service, comply with legal
                            obligations, resolve disputes, and enforce our agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            5. Your Rights and Choices
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>You can view and update your account details from your Profile page</li>
                            <li>
                                You can request deletion of your account and associated personal data
                                by contacting us at the email below
                            </li>
                            <li>You can opt out of promotional emails at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            6. Children's Privacy
                        </h2>
                        <p>
                            The Service is not directed to children under 13, and we do not knowingly
                            collect personal information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            7. Security
                        </h2>
                        <p>
                            We use reasonable technical and organizational measures to protect your
                            information. However, no method of transmission over the internet or
                            electronic storage is 100% secure, and we cannot guarantee absolute
                            security.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            8. Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you
                            of any changes by posting the new policy on this page and updating the
                            "Last updated" date above.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-brown mb-3">
                            9. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:info@aarions.in" className="text-brand-gold font-semibold">
                                info@aarions.in
                            </a>{" "}
                            or through our{" "}
                            <Link to="/contact" className="text-brand-gold font-semibold">
                                Contact page
                            </Link>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

