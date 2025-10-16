'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Globe,
  Smartphone,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const partners = [
    'Stripe',
    'Square',
    'WooCommerce',
    'Shopify',
    'QuickBooks',
    'Xero',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/lightspeed-logo-dark.svg"
                alt="Lightspeed"
                className="h-6"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#resources" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Resources
              </a>
              <a href="#support" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Support
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900 hidden md:inline">
                Sign in
              </a>
              <Link href="/get-started">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold tracking-wider text-red-600 uppercase">
                  Point of sale for your business
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Be the best in your business
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Lightspeed is an all-in-one commerce platform that helps businesses accelerate growth,
                provide the best customer experiences and become a go-to destination in their space.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/get-started">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 h-12">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Setup in minutes</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/hero-product.png"
                  alt="Lightspeed POS System"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
              Integrates with your favorite tools
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-purple-50 to-pink-100 aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-gray-500 text-sm">POS System Image</p>
                </div>
              </div>
            </motion.div>

            {/* Text Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                One fast, complete point of sale system
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Ring up sales, take payments and manage your entire business from one powerful platform.
                Our cloud-based POS works seamlessly across all your devices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Accept all payment types including tap, chip, and mobile wallets</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Manage inventory in real-time across all locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Built-in customer management and loyalty programs</span>
                </li>
              </ul>
              <Link href="/get-started">
                <Button variant="outline" size="lg" className="border-gray-300">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sell anywhere your customers are
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Unify your in-store, online and on-the-go sales channels. Give your customers a seamless
                experience no matter how they choose to shop.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Built-in eCommerce platform with customizable storefront</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mobile POS for selling at events, pop-ups and markets</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Synchronized inventory across all channels</span>
                </li>
              </ul>
              <Link href="/get-started">
                <Button variant="outline" size="lg" className="border-gray-300">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Image Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-green-50 to-teal-100 aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Omnichannel Image</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-orange-50 to-amber-100 aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Analytics Image</p>
                </div>
              </div>
            </motion.div>

            {/* Text Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Insights to help your business grow
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Make smarter decisions with powerful analytics and reporting. Track sales, inventory,
                and customer data in real-time to optimize your operations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Real-time sales and performance dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Detailed inventory and product performance reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Customer insights and purchasing patterns</span>
                </li>
              </ul>
              <Link href="/get-started">
                <Button variant="outline" size="lg" className="border-gray-300">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses using Lightspeed to power their commerce.
              Get set up in minutes and start selling today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-10 h-14 text-lg"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1 */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Products</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Retail POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Restaurant POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Golf POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">eCommerce</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Request Demo</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/lightspeed-logo-white.png"
                  alt="Lightspeed"
                  className="h-5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-sm text-gray-400">© 2024 Lightspeed Commerce Inc.</span>
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
