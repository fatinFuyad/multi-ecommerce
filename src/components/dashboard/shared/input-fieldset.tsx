import { Info } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  label: string;
  description?: string;
  children: ReactNode;
}

export default function InputFieldset({ label, description, children }: Props) {
  return (
    <div>
      <fieldset className="border rounded-md p-4">
        <legend className="px-2">
          <label>{label}</label>
          {/* <FormLabel>{label}</FormLabel> // causes useField context error */}
        </legend>
        {description && (
          <div className="flex items-center text-muted-foreground">
            <Info className="mr-1 size-5 flex-shrink-0" />
            <p className="text-sm">{description}</p>
          </div>
        )}
        {children}
      </fieldset>
    </div>
  );
}
