import React, { ReactNode } from "react";
import { format } from "date-fns";

interface DocumentTemplateProps {
  children: ReactNode;
  title: string;
  date?: Date;
  documentType?: string;
  recipientName?: string;
  showFooter?: boolean;
  printable?: boolean;
}

export default function DocumentTemplate({
  children,
  title,
  date = new Date(),
  documentType = "",
  recipientName = "",
  showFooter = true,
  printable = true,
}: DocumentTemplateProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md max-w-4xl mx-auto ${printable ? 'print:shadow-none print:mx-0 print:w-full' : ''}`}>
      {/* Document Header */}
      <div className="flex justify-between items-start p-8 border-b">
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-neutral-900">
            <span className="font-extrabold">wug</span>
            <span className="text-neutral-600">web</span>
          </div>
        </div>
        <div className="flex items-center justify-center bg-black rounded-full p-3 w-14 h-14">
          <div className="text-white font-bold text-lg">
            <span className="text-orange-400 text-2xl">W</span>
            <span className="relative -left-1 -top-1.5">•</span>
            <span className="relative -left-2 -top-0.5">•</span>
          </div>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-semibold text-neutral-800">{title}</h1>
      </div>

      {/* Document Date and Recipient */}
      <div className="px-8 pb-6 space-y-2">
        <div className="flex">
          <span className="font-medium w-32">Date:</span>
          <span>{format(date, "MMMM do, yyyy")}</span>
        </div>
        {recipientName && (
          <div className="flex">
            <span className="font-medium w-32">To:</span>
            <span>{recipientName}</span>
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className="px-8 pb-8">
        {children}
      </div>

      {/* Document Footer */}
      {showFooter && (
        <div className="px-8 py-6 border-t bg-neutral-50 rounded-b-lg flex justify-between items-center text-sm text-neutral-600">
          <div>
            <div className="font-semibold mb-1">Wug Web Services Private Limited</div>
            <div>WeWork Berger Delhi One, Floor 19, C-001/A2, Sector 16B, Noida, UP- 201301, IN</div>
            <div>CIN : U72900UP2020PTC138834</div>
          </div>
          <div className="text-right">
            <div className="mb-1">hello@wugweb.com</div>
            <div>+91 120 3121657</div>
            <div className="font-semibold mt-1">
              <span className="font-extrabold">wug</span>
              <span className="text-neutral-500">web</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}