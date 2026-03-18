export default function ServicesPage() {
  const services = [
    {
      id: 'ftth',
      title: 'Fiber Internet Installation (FTTH)',
      description: 'Ultra-fast fiber-to-the-home internet with speeds up to 1Gbps',
      features: ['High-speed connectivity', 'Low latency', 'Future-proof technology', 'Reliable 99.9% uptime'],
      image: '/src/assets/servicesPage/fiber optics.jpg'
    },
    {
      id: 'wireless',
      title: 'Wireless Internet (Fixed Wireless Access)',
      description: 'Fast wireless connectivity without fiber infrastructure',
      features: ['Quick deployment', 'Wide coverage', 'No installation hassle', 'Flexible plans'],
      image: '/src/assets/servicesPage/wireless internet.jpg'
    },
    {
      id: 'business',
      title: 'Business Dedicated Internet (DIA)',
      description: 'Enterprise-grade dedicated connections with guaranteed bandwidth',
      features: ['Dedicated bandwidth', 'SLA guarantee', 'Priority support', 'Scalable solutions'],
      image: '/src/assets/servicesPage/business internet.jpg'
    },
    {
      id: 'home',
      title: 'Home Broadband Packages',
      description: 'Affordable internet plans for every household',
      features: ['Multiple speed options', 'No data caps', 'Affordable pricing', 'Easy installation'],
      image: '/src/assets/servicesPage/home internet.jpg'
    },
    {
      id: 'setup',
      title: 'Network Setup & Configuration',
      description: 'Professional network installation and optimization',
      features: ['Expert installation', 'Device configuration', 'Network optimization', 'Testing & support'],
      image: '/src/assets/servicesPage/Network Setup.jpg'
    },
    {
      id: 'router',
      title: 'Router Sales & Configuration',
      description: 'Premium routers and networking equipment with configuration service',
      features: ['Latest equipment', 'Professional setup', 'Warranty included', 'Technical support'],
      image: '/src/assets/servicesPage/Router Sales.jpg'
    },
    {
      id: 'wifi',
      title: 'Managed Wi-Fi Services',
      description: 'Complete Wi-Fi management for homes and businesses',
      features: ['Coverage optimization', 'Security management', 'Regular monitoring', 'Update management'],
      image: '/src/assets/servicesPage/Managed Wi-Fi Services.jpg'
    },
    {
      id: 'security',
      title: 'Network Security (Firewalls, Monitoring)',
      description: 'Comprehensive network security and monitoring solutions',
      features: ['24/7 monitoring', 'DDoS protection', 'Threat detection', 'Security reports'],
      image: '/src/assets/servicesPage/Network Security.jpg'
    },
    {
      id: 'voip',
      title: 'VoIP & Business Telephony',
      description: 'Professional business phone systems and VoIP services',
      features: ['Crystal clear calls', 'Call forwarding', 'Voicemail to email', 'Mobile integration'],
      image: '/src/assets/servicesPage/Business Telephony.jpg'
    },
    {
      id: 'cctv',
      title: 'CCTV & Smart Surveillance Integration',
      description: 'Professional CCTV and surveillance system installation and integration',
      features: ['HD cameras', 'Remote monitoring', 'Cloud storage', 'Smart alerts'],
      image: '/src/assets/servicesPage/CCTV.jpg'
    },
    {
      id: 'cloud',
      title: 'Cloud Backup & Storage Solutions',
      description: 'Secure cloud backup and storage for your data',
      features: ['Automated backups', 'Encryption', '99.99% uptime', 'Easy recovery'],
      image: '/src/assets/servicesPage/cloud.jpg'
    },
    {
      id: 'hosting',
      title: 'Website Hosting & Domain Services',
      description: 'Reliable web hosting and domain registration services',
      features: ['Fast hosting', 'SSL certificates', 'Email hosting', '24/7 support'],
      image: '/src/assets/servicesPage/web hosting.jpg'
    },
    {
      id: 'support',
      title: '24/7 Technical Support',
      description: 'Round-the-clock technical support team ready to help',
      features: ['Phone support', 'Live chat', 'Email tickets', 'Remote assistance'],
      image: '/src/assets/servicesPage/support.jpg'
    },
    {
      id: 'enterprise',
      title: 'SLA-based Enterprise Support Plans',
      description: 'Premium support with guaranteed response times and SLAs',
      features: ['Guaranteed response time', 'Dedicated support', 'Priority escalation', 'Custom SLAs'],
      image: '/src/assets/servicesPage/SLA.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-brand-100">Comprehensive Internet and Telecommunications Solutions</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-0 border border-slate-100 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover opacity-0 animate-fadeIn"
                    style={{
                      animation: 'fadeIn 0.6s ease-in-out forwards'
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-brand-500 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Contact our team to discuss your specific needs and get a customized package tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700 transition">
              Contact Sales
            </button>
            <button className="border-2 border-brand-600 text-brand-600 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition">
              Request a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
