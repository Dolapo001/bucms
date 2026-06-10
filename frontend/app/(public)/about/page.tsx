'use client';

import React from 'react';
import Card, { CardBody } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default function AboutPage() {
  const leadership = [
    { name: 'Rev. Dr. A. A. Olayinka', title: 'University Chaplain', role: 'Chief Spiritual Officer', desc: 'Oversees the spiritual growth and pastoral care of the entire university campus.' },
    { name: 'Pastor Mrs. D. O. Kolawole', title: 'Associate Chaplain', role: 'Counseling & Student Care', desc: 'Coordinates student counseling services, home fellowship networks, and outreach programs.' },
    { name: 'Dr. John Kayode', title: 'Choir Director', role: 'Worship Administration', desc: 'Directs the Bowen Worship choir and instrumental praise squads.' }
  ];

  return (
    <div className="bg-surface-50 dark:bg-surface-950 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        {/* Title */}
        <div className="text-center flex flex-col items-center gap-3">
          <Badge variant="gold" className="px-4 py-1.5 uppercase font-bold tracking-wider">Our Calling</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-surface-900 dark:text-white">
            About Bowen University Chapel
          </h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-xl italic mt-2">
            "A campus centered on Christ, empowering minds for outstanding academic breakthroughs and godly leadership."
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-primary-800">
            <CardBody className="flex flex-col gap-3">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Our Mission</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                To build a scripture-centered academic environment by providing sound spiritual guidance, quality pastoral counseling, and dynamic corporate worship encounters.
              </p>
            </CardBody>
          </Card>

          <Card className="border-l-4 border-l-gold-500">
            <CardBody className="flex flex-col gap-3">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Our Vision</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                To emerge as a benchmark Christian campus chapel where student leadership, academic integrity, and deep godliness thrive in perfect harmony.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Leadership Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-500">Spiritual Oversight</span>
            <h2 className="text-2xl font-extrabold text-surface-900 dark:text-white">Chapel Pastoral Leadership</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((lead, idx) => (
              <Card key={idx} hoverEffect className="bg-white dark:bg-surface-900">
                <CardBody className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-50 dark:bg-gold-950/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                    {lead.name[5] || '👤'}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-base font-bold text-surface-900 dark:text-white leading-none">{lead.name}</h4>
                    <span className="text-xs font-bold text-gold-600 dark:text-gold-400 mt-1">{lead.title}</span>
                    <span className="text-[10px] text-surface-400 uppercase font-semibold tracking-wider">{lead.role}</span>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                    {lead.desc}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
