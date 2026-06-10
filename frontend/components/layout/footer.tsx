'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-950 text-white border-t border-primary-900/40">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center text-primary-950 font-bold">
                BU
              </div>
              <span className="font-display italic text-lg text-gold-400 font-bold">
                Bowen Chapel
              </span>
            </div>
            <p className="text-xs text-primary-200/70 leading-relaxed">
              Excellence and Godliness. The Bowen University Chapel is dedicated to nurturing student leadership, spiritual resilience, and institutional integrity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500">
              Chapel Life
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/sermons" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Audio Sermons
              </Link>
              <Link href="/events" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Events Calendar
              </Link>
              <Link href="/announcements" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Announcements
              </Link>
            </div>
          </div>

          {/* Student Portal Quick access */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500">
              Portals
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/login" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Member Login
              </Link>
              <Link href="/register" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Register Account
              </Link>
              <Link href="/login" className="text-sm text-primary-200/70 hover:text-white transition-colors">
                Admin Console
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-xs text-primary-200/70">
              <p className="flex items-center gap-2">
                <span>📍</span> Bowen University Campus, Iwo, Osun State, Nigeria
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span> chapel@bowen.edu.ng
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> +234 (0) 800-CHAPEL-BU
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-200/50">
            &copy; {new Date().getFullYear()} Bowen University Chapel. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-primary-200/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
