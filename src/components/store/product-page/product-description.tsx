"use client";
import DOMPurify from "dompurify";

export default function ProductDescription({ text }: { text: [string, string] }) {
  // sanitizing the HTML description, preventing Malicious HTML
  const sanitizedProductDesc = DOMPurify.sanitize(text[0]);
  const sanitizedVariantDesc = DOMPurify.sanitize(text[1]);
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-secondary-foreground text-2xl font-bold">Description</h2>
      </div>
      {/* Display both descriptions */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedProductDesc }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedVariantDesc }} />
    </div>
  );
}
