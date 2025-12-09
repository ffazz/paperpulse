'use client'

import { HiDocumentText, HiArrowDownTray } from 'react-icons/hi2'
import { Button } from '@/components/ui/Button'

export default function SampleDataCard() {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8">
      <div className="flex items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <HiDocumentText className="w-7 h-7 text-white" />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-midnight mb-2">CSV Format Guide</h3>
            <p className="text-midnight/60">
              Your CSV file should include these columns for proper import
            </p>
          </div>

          {/* Format Example */}
          <div className="bg-midnight/5 rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <div className="text-midnight/80 whitespace-nowrap">
              <span className="text-accent">title</span>,
              <span className="text-accent">author</span>,
              <span className="text-accent">genre</span>,
              <span className="text-accent">rating</span>,
              <span className="text-accent">vibes</span>,
              <span className="text-accent">themes</span>,
              <span className="text-accent">pages</span>,
              <span className="text-accent">year</span>,
              <span className="text-accent">language</span>
            </div>
            <div className="text-midnight/60 mt-2 whitespace-nowrap">
              "Book Title","Author Name","Fiction",4.5,"romantic;nostalgic","love;memory",350,2024,"English"
            </div>
          </div>

          {/* Field Descriptions */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { field: 'vibes', desc: 'Separate multiple values with semicolons (;)' },
              { field: 'themes', desc: 'Separate multiple values with semicolons (;)' },
              { field: 'rating', desc: 'Decimal number (0.0 - 5.0)' },
              { field: 'language', desc: '"Indonesian" or "English"' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-midnight">{item.field}:</span>
                  <span className="text-sm text-midnight/60 ml-2">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Download Sample Button */}
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => window.open('/sample-books.csv', '_blank')}
          >
            <HiArrowDownTray className="w-4 h-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
