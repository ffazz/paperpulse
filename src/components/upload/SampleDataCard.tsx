'use client'

import { HiDocumentText, HiArrowDownTray } from 'react-icons/hi2'
import { Button } from '@/components/ui/Button'

export default function SampleDataCard() {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <HiDocumentText className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
        </div>

        <div className="flex-1 space-y-3 md:space-y-4">
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-midnight mb-1 md:mb-2">CSV Format Guide</h3>
            <p className="text-xs md:text-sm lg:text-base text-midnight/60">
              Your CSV file should include these columns for proper import
            </p>
          </div>

          {/* Format Example */}
          <div className="bg-midnight/5 rounded-lg md:rounded-xl p-3 md:p-4 font-mono text-xs overflow-x-auto">
            <div className="text-midnight/80 whitespace-nowrap text-xs">
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
            <div className="text-midnight/60 mt-2 whitespace-nowrap text-xs">
              "Book Title","Author Name","Fiction",4.5,"romantic;nostalgic","love;memory",350,2024,"English"
            </div>
          </div>

          {/* Field Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              { field: 'vibes', desc: 'Separate multiple values with semicolons (;)' },
              { field: 'themes', desc: 'Separate multiple values with semicolons (;)' },
              { field: 'rating', desc: 'Decimal number (0.0 - 5.0)' },
              { field: 'language', desc: '"Indonesian" or "English"' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-accent mt-1 md:mt-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-midnight text-xs md:text-sm">{item.field}:</span>
                  <span className="text-xs md:text-sm text-midnight/60 ml-1 md:ml-2">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Download Sample Button */}
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 md:mt-4 w-full md:w-auto"
            onClick={() => window.open('/sample-books.csv', '_blank')}
          >
            <HiArrowDownTray className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
