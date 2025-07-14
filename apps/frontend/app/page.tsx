"use client"
import React from 'react';
import { 
  Shield, 
  Zap, 
  Bell, 
  BarChart3, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Star,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import  { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Monitor Your Website&#39;s
              <span className="text-blue-400 block">Uptime &amp; Performance</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant alerts when your website goes down. Monitor uptime, performance, and user experience 
              from multiple locations worldwide with our comprehensive monitoring platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={()=>{router.push('/dashboard')}} className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center cursor-pointer">
                  Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-md mr-3 border border-gray-700">
                  <div className="w-0 h-0 border-l-[6px] border-l-blue-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                </div>
                Watch Demo
              </button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                14-Day Free Trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">30s</div>
              <div className="text-gray-400">Check Interval</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-gray-400">Global Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-400">Websites Monitored</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Monitoring Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to keep your website running smoothly and your users happy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 border border-blue-800">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Monitoring</h3>
              <p className="text-gray-400">Monitor your websites 24/7 with checks every 30 seconds from multiple global locations.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-6 border border-green-800">
                <Bell className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Alerts</h3>
              <p className="text-gray-400">Get notified immediately via email, SMS, Slack, or webhook when your site goes down.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 border border-purple-800">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Performance Analytics</h3>
              <p className="text-gray-400">Track response times, uptime statistics, and performance trends over time.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center mb-6 border border-orange-800">
                <Globe className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Global Monitoring</h3>
              <p className="text-gray-400">Monitor from 15+ locations worldwide to ensure your site is accessible everywhere.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center mb-6 border border-red-800">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">SSL Monitoring</h3>
              <p className="text-gray-400">Track SSL certificate expiration dates and get alerts before they expire.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6 border border-indigo-800">
                <Smartphone className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Mobile App</h3>
              <p className="text-gray-400">Monitor your sites on the go with our iOS and Android mobile applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Add Your Website</h3>
              <p className="text-gray-400">Simply enter your website URL and configure monitoring settings in seconds.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Configure Alerts</h3>
              <p className="text-gray-400">Set up notification preferences and choose how you want to be alerted.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Monitor &amp; Relax</h3>
              <p className="text-gray-400">We&#39;ll monitor your site 24/7 and alert you instantly if anything goes wrong.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your monitoring needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $9<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">Perfect for small websites</p>
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors mb-6">
                  Start Free Trial
                </button>
                <ul className="text-left space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">5 websites</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">1-minute checks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Email alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Basic dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $29<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">For growing businesses</p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors mb-6">
                  Start Free Trial
                </button>
                <ul className="text-left space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">25 websites</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">30-second checks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Email, SMS, Slack alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">SSL monitoring</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $99<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">For large organizations</p>
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors mb-6">
                  Start Free Trial
                </button>
                <ul className="text-left space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Unlimited websites</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">10-second checks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">All alert methods</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Custom dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our customers are saying about UptimeGuard
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                &quot;UptimeGuard has been a game-changer for our business. We&#39;ve reduced downtime by 90% and our customers are happier than ever.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">John Smith</div>
                  <div className="text-gray-400">CTO, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                &quot;The instant alerts saved us from a major outage. The setup was incredibly easy and the interface is beautiful.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="text-gray-400">Founder, StartupXYZ</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                &quot;Best monitoring tool we&#39;ve used. The global monitoring locations give us confidence that our site is truly accessible worldwide.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">Mike Chen</div>
                  <div className="text-gray-400">DevOps Lead, Enterprise Co</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Monitor Your Website?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of websites already using UptimeGuard to ensure maximum uptime and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>{router.push('/dashboard')}} className=" cursor-pointer bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Start Monitoring
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">UptimeGuard</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most reliable website monitoring platform trusted by thousands of businesses worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UptimeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;