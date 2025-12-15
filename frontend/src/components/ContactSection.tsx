import { Phone, Mail, MapPin, Clock, Send, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  useEffect(() => {
    // Responsive layout handling
    const handleResize = () => {
      window.innerWidth < 768;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Formulaire de contact envoyé:', formData);
      setSubmitStatus('success');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Appelez-nous',
      value: '+216 71 123 456',
      subtext: '24/7 - Disponible',
      action: 'tel:+21671123456',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'ayarisouhi@gmail.com',
      subtext: 'Réponse < 2h',
      action: 'mailto:ayarisouhi@gmail.com',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Tunis, Tunisie',
      subtext: 'Centre El Ghazela',
      action: '#',
      color: 'text-orange-600 bg-orange-100',
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: 'Lun - Ven: 08:00 - 18:00',
      subtext: 'Sam: 09:00 - 14:00',
      action: '#',
      color: 'text-green-600 bg-green-100',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30 relative overflow-hidden">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
        style={{ y, opacity }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ['50%', '-50%']),
          opacity 
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge premium */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nous Sommes Là Pour Vous
            </span>
          </motion.div>

          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Contactez Notre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Équipe d'Experts
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Avez-vous des questions sur nos services ? Notre équipe est disponible 24/7 pour vous aider.
            N'hésitez pas à nous contacter par téléphone, email ou via le formulaire ci-dessous.
          </motion.p>
        </motion.div>

        {/* Cartes de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -8 }}
                className="group p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`mb-4 p-3 rounded-lg w-fit ${method.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-blue-600 font-semibold mb-1">{method.value}</p>
                <p className="text-sm text-gray-600">{method.subtext}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Formulaire de contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Envoyez-nous un Message</h3>
            <p className="text-gray-600 mb-8">Nous répondons généralement dans les 24 heures</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                    Nom Complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-blue-50/50 transition-all rounded-xl"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-blue-50/50 transition-all rounded-xl"
                  />
                </motion.div>
              </div>

              {/* Téléphone et Sujet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 xx xxx xxx"
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-blue-50/50 transition-all rounded-xl"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet du message"
                    required
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-blue-50/50 transition-all rounded-xl"
                  />
                </motion.div>
              </div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows={5}
                  required
                  className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-blue-50/50 transition-all resize-none rounded-xl"
                />
              </motion.div>

              {/* Messages de statut */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-xl bg-green-100 border-2 border-green-300 text-green-700 flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  ✅ Message envoyé avec succès! Nous vous recontacterons bientôt.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-xl bg-red-100 border-2 border-red-300 text-red-700 flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  ❌ Une erreur s'est produite. Veuillez réessayer.
                </motion.div>
              )}

              {/* Bouton d'envoi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '24/7', label: 'Support Disponible', icon: Phone },
            { number: '100%', label: 'Confidentiel', icon: Shield },
            { number: '<2h', label: 'Temps de Réponse', icon: Zap },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
