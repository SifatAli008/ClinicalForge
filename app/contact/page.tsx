'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, Users, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['general', 'technical', 'clinical', 'partnership']),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: 'general',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Get in touch with our team',
      value: 'contact@clinicalforge.com',
      link: 'mailto:contact@clinicalforge.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Speak with our support team',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Office',
      description: 'Visit our headquarters',
      value: '123 Medical Center Dr, Suite 100',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      description: 'When we&apos;re available',
      value: 'Mon-Fri: 9AM-6PM EST',
      link: '#',
    },
  ];

  const inquiryTypes = [
    {
      value: 'general',
      label: 'General Inquiry',
      description: 'General questions about ClinicalForge',
      icon: MessageSquare,
    },
    {
      value: 'technical',
      label: 'Technical Support',
      description: 'Help with platform features',
      icon: Database,
    },
    {
      value: 'clinical',
      label: 'Clinical Support',
      description: 'Clinical data and validation questions',
      icon: Users,
    },
    {
      value: 'partnership',
      label: 'Partnership',
      description: 'Collaboration opportunities',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Have questions about ClinicalForge? We&apos;re here to help. Reach out to our team for support, 
            technical assistance, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  We&apos;re here to help with any questions or concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {info.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            {info.description}
                          </p>
                          <a
                            href={info.link}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="mt-6 border-2 border-green-200 dark:border-green-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                <CardTitle className="text-lg text-green-900 dark:text-green-100">
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">General Inquiries</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Within 24 hours
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Technical Support</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Within 4 hours
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Clinical Support</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Within 8 hours
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isSubmitted && (
                  <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Thank you for your message! We&apos;ll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="Your full name"
                        className="focus:border-indigo-500"
                      />
                      {errors.name && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="your.email@example.com"
                        className="focus:border-indigo-500"
                      />
                      {errors.email && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Inquiry Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <label
                            key={type.value}
                            className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('type')}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {type.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {type.description}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      {...register('subject')}
                      placeholder="Brief description of your inquiry"
                      className="focus:border-indigo-500"
                    />
                    {errors.subject && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      {...register('message')}
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[120px] focus:border-indigo-500"
                    />
                    {errors.message && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 