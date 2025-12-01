"use client";

import React, { useActionState, useEffect, useRef, useState, ReactNode, useCallback, useMemo, memo } from 'react';
import { motion, LayoutGroup, cubicBezier } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { submitContactForm, type ContactFormState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { SendButton } from '@/components/ui/send-button';

const easeCurve = cubicBezier(0.22, 1, 0.36, 1);
const entranceEase = cubicBezier(0.76, 0, 0.24, 1);
const socialEase = cubicBezier(0.34, 1.56, 0.64, 1);

const getFieldTransition = (delay = 0.3) => ({ duration: 0.6, delay, ease: entranceEase });

type LocalContactFormProps = {
  className?: string;
  isCompact?: boolean;
  contentVisible?: boolean;
};

function ContactForm({ className, isCompact = false, contentVisible = false }: LocalContactFormProps = {}) {
  const [state, formAction] = useActionState<ContactFormState, FormData>(submitContactForm, {} as ContactFormState);
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [formValues, setFormValues] = useState(() => ({ name: '', email: '', message: '' }));
  const [clientErrors, setClientErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      const animationTimer = window.setTimeout(() => {
        toast({ title: 'Success', description: state.message || 'Thank you for your message!', duration: 3000 });
        setFormValues({ name: '', email: '', message: '' });
        setIsAnimating(false);
      }, 3000);

      return () => window.clearTimeout(animationTimer);
    }

    if (state.errors || (state.message && state.success === false)) {
      const errorTimer = window.setTimeout(() => {
        setIsAnimating(false);
        if (state.errors?.name?.length) {
          nameRef.current?.focus();
        } else if (state.errors?.email?.length) {
          emailRef.current?.focus();
        } else if (state.errors?.message?.length) {
          messageRef.current?.focus();
        } else {
          nameRef.current?.focus();
        }
      }, 0);

      return () => window.clearTimeout(errorTimer);
    }
  }, [state, toast]);

  const handleValidateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Validate fields before triggering animation
    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const message = formValues.message.trim();
    const errors: typeof clientErrors = {};

    // Name validation
    if (!name) {
      errors.name = ['Name is required'];
    } else if (name.length < 2) {
      errors.name = ['Name must be at least 2 characters'];
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = ['Email is required'];
    } else if (!emailRegex.test(email)) {
      errors.email = ['Please enter a valid email'];
    }

    // Message validation
    if (!message) {
      errors.message = ['Message is required'];
    } else if (message.length < 10) {
      errors.message = ['Message must be at least 10 characters'];
    }

    // If errors exist, show them and prevent submission
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setClientErrors(errors);
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.message) messageRef.current?.focus();
      return;
    }

    // Clear client errors if everything is valid
    setClientErrors({});
    setIsAnimating(true);
  };

  // stabilized change handlers
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFormValues((prev) => (prev.name === v ? prev : { ...prev, name: v }));
    setClientErrors((prev) => (prev.name ? { ...prev, name: undefined } : prev));
  }, []);
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFormValues((prev) => (prev.email === v ? prev : { ...prev, email: v }));
    setClientErrors((prev) => (prev.email ? { ...prev, email: undefined } : prev));
  }, []);
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setFormValues((prev) => (prev.message === v ? prev : { ...prev, message: v }));
    setClientErrors((prev) => (prev.message ? { ...prev, message: undefined } : prev));
  }, []);

  const isMobile = useIsMobile();
  const baseDelay = 0.08;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleValidateSubmit}
      noValidate
      className={className ?? 'overflow-visible'}
      style={{ paddingBottom: 'clamp(0.5rem, 1vh, 0.75rem)' }}
    >
      <LayoutGroup id="contact-form-layout">
        <motion.div
          layout
          animate={contentVisible ? { y: 0 } : { y: 0 }}
          transition={{ layout: { duration: 0.5, ease: easeCurve } }}
          className="grid grid-cols-1"
          style={{
            willChange: 'transform, height',
            rowGap: 'clamp(0.75rem, 1.6vh, 1.25rem)',
            paddingTop: 'clamp(0.3rem, 0.8vh, 0.75rem)',
          }}
        >
          {/* Name */}
          <motion.div layoutId="name-field" layout="position" className="space-y-2">
            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ y: '100%', opacity: 0 }}
              animate={!isMobile && contentVisible ? { y: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 0 * 0.12, ease: entranceEase } : getFieldTransition(0.18)}
            >
              <Label htmlFor="name" className="mb-1 font-semibold text-foreground whitespace-nowrap flex items-center gap-2" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}>
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Name
              </Label>
            </motion.div>

            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ x: -24, opacity: 0 }}
              animate={!isMobile && contentVisible ? { x: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { x: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 0 * 0.12 + 0.06, ease: entranceEase } : getFieldTransition(0.24)}
            >
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                ref={nameRef}
                value={formValues.name}
                onChange={handleNameChange}
                className="w-full rounded-xl border-foreground/20 bg-card/30 text-foreground placeholder:text-foreground/40 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 focus:border-primary focus:shadow-md focus:shadow-primary/10 focus:bg-card/50"
                style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', paddingInline: 'clamp(1rem, 2.2vw, 1.5rem)', paddingBlock: 'clamp(1.1rem, 2.5vh, 1.6rem)' }}
              />
              <p className={`${(clientErrors.name || state.errors?.name) && (clientErrors.name?.length || state.errors?.name?.length) ? 'text-red-400 visible font-medium' : 'invisible'}`} style={{ marginTop: 'clamp(0.35rem, 0.8vh, 0.6rem)', fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' }}>
                {clientErrors.name?.[0] || state.errors?.name?.[0] || 'Invalid name'}
              </p>
            </motion.div>
          </motion.div>

          {/* Email */}
          <motion.div
            layoutId="email-field"
            layout="position"
            className="space-y-2"
          >
            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ y: '100%', opacity: 0 }}
              animate={!isMobile && contentVisible ? { y: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 1 * 0.12, ease: entranceEase } : getFieldTransition(0.32)}
            >
              <Label
                htmlFor="email"
                className="mb-1 font-semibold text-foreground whitespace-nowrap flex items-center gap-2"
                style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}
              >
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </Label>
            </motion.div>

            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ x: -24, opacity: 0 }}
              animate={!isMobile && contentVisible ? { x: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { x: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 1 * 0.12 + 0.06, ease: entranceEase } : getFieldTransition(0.38)}
            >
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                required
                ref={emailRef}
                value={formValues.email}
                onChange={handleEmailChange}
                className="w-full rounded-xl border-foreground/20 bg-card/30 text-foreground placeholder:text-foreground/40 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 focus:border-primary focus:shadow-md focus:shadow-primary/10 focus:bg-card/50"
                style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                  paddingInline: 'clamp(1rem, 2.2vw, 1.5rem)',
                  paddingBlock: 'clamp(1.1rem, 2.5vh, 1.6rem)',
                }}
              />
              <p
                className={`${
                  (clientErrors.email || state.errors?.email) && (clientErrors.email?.length || state.errors?.email?.length)
                    ? 'text-red-400 visible font-medium'
                    : 'invisible'
                }`}
                style={{
                  marginTop: 'clamp(0.35rem, 0.8vh, 0.6rem)',
                  fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                }}
              >
                {clientErrors.email?.[0] || state.errors?.email?.[0] || 'Invalid email'}
              </p>
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            layoutId="message-field"
            layout="position"
            className="space-y-2"
          >
            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ y: '100%', opacity: 0 }}
              animate={contentVisible ? { y: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 2 * 0.12, ease: entranceEase } : getFieldTransition(0.46)}
            >
              <Label
                htmlFor="message"
                className="mb-1 font-semibold text-foreground whitespace-nowrap flex items-center gap-2"
                style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}
              >
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message
              </Label>
            </motion.div>

            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ x: -24, opacity: 0 }}
              animate={contentVisible ? { x: 0, opacity: 1 } : undefined}
              whileInView={isMobile ? { x: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 2 * 0.12 + 0.06, ease: entranceEase } : getFieldTransition(0.52)}
            >
              <Textarea
                id="message"
                name="message"
                placeholder="How can I help you?"
                required
                ref={messageRef}
                value={formValues.message}
                onChange={handleMessageChange}
                className={`w-full rounded-xl border-foreground/20 bg-card/30 text-foreground placeholder:text-foreground/40 shadow-sm transition-all duration-300 focus:border-primary focus:shadow-md focus:shadow-primary/10 focus:bg-card/50 resize-y lg:resize-none ${
                  isCompact ? 'min-h-[7.5rem]' : 'min-h-[9rem] max-h-[12rem]'
                }`}
                style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                  paddingInline: 'clamp(1rem, 2.2vw, 1.5rem)',
                  paddingBlock: 'clamp(1.1rem, 2.5vh, 1.6rem)',
                }}
              />
              <p
                className={`${
                  (clientErrors.message || state.errors?.message) && (clientErrors.message?.length || state.errors?.message?.length)
                    ? 'text-red-400 visible font-medium'
                    : 'invisible'
                }`}
                style={{
                  marginTop: 'clamp(0.35rem, 0.8vh, 0.6rem)',
                  fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                }}
              >
                {clientErrors.message?.[0] || state.errors?.message?.[0] || 'Invalid message'}
              </p>
            </motion.div>
          </motion.div>

          {/* Button */}
          <motion.div
            layoutId="send-button"
            layout="position"
            className="mt-2 flex justify-end"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={!isMobile && contentVisible ? { scale: 1, opacity: 1 } : undefined}
              whileInView={isMobile ? { scale: 1, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              transition={isMobile ? { duration: 0.45, delay: baseDelay + 3 * 0.12 + 0.06, ease: socialEase } : { duration: 0.45, delay: 0.6, ease: socialEase }}
            >
              <SendButton isSubmitting={isAnimating} />
            </motion.div>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </form>
  );
}

type ContactSectionProps = {
  children?: ReactNode;
  isCompact?: boolean;
  footerVisible?: boolean;
  setBlockNavigation?: (value: boolean) => void;
  navigate?: (index: number) => void;
  currentSection?: number;
  parentContentVisible?: boolean;
  onCardEntered?: (entered: boolean) => void;
};

export const ContactSection = memo(function ContactSection({ isCompact = false, footerVisible = false, parentContentVisible = false, onCardEntered }: ContactSectionProps) {
  const sectionClass = useMemo(
    () => `w-full h-full flex flex-col items-center ${footerVisible ? 'justify-center pt-4 pb-10 md:pt-6 md:pb-20' : 'justify-center pt-8 pb-24 sm:py-12 md:pt-16 md:pb-24 lg:pt-16 lg:pb-24'} scroll-mt-16 overflow-x-hidden overflow-y-hidden`,
    [footerVisible]
  );

  const [cardEntered, setCardEntered] = useState(false);

  return (
    <motion.section layout transition={{ layout: { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 } }} id="contact" className={sectionClass}>
      <motion.div layout className="w-full px-4 sm:px-8 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Title */}
        <motion.div layout className={`${footerVisible ? 'mb-6' : 'mb-8 sm:mb-12'} space-y-2 text-center`}>
          <motion.div style={{ overflow: 'hidden' }}>
            <motion.h2
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3.125rem)' }}
              className="font-bold tracking-tighter font-headline text-foreground"
              initial={{ y: '100%', opacity: 0 }}
              animate={parentContentVisible ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: easeCurve }}
            >
              Contact Me
            </motion.h2>
          </motion.div>
        </motion.div>

        {/* Main Layout */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="relative rounded-xl border border-foreground/10 bg-card/30 p-6 lg:p-8 shadow-sm"
            initial={{ y: '10%', opacity: 0 }}
            animate={parentContentVisible ? { y: 0, opacity: 1 } : { y: '10%', opacity: 0 }}
            transition={getFieldTransition(0.12)}
            onAnimationComplete={() => {
              if (parentContentVisible) setCardEntered(true);
              if (parentContentVisible) onCardEntered?.(true);
            }}
          >
            <div className="relative z-10">
              <ContactForm isCompact={isCompact} contentVisible={!useIsMobile() && cardEntered} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
});
