import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, "Företagsnamn måste vara minst 2 tecken"),
  orgNumber: z.string()
    .regex(/^\d{6}-\d{4}$/, "Organisationsnummer måste vara i format XXXXXX-XXXX")
    .refine((val) => {
      const digits = val.replace("-", "");
      return digits.length === 10;
    }, "Organisationsnummer måste vara 10 siffror"),
  businessType: z.string().min(1, "Verksamhetstyp måste väljas"),
  numberOfEmployees: z.string().min(1, "Antal anställda måste anges"),
  contactPerson: z.object({
    role: z.string().min(1, "Roll måste väljas"),
    name: z.string().min(2, "För- och efternamn måste anges"),
    email: z.string().email("Ogiltig e-postadress"),
    phone: z.string()
      .regex(/^(\+46|0)(7[0-9]|[1-9][0-9])-?\d{3}\s?\d{2}\s?\d{2}$/, "Ange giltigt svenskt telefonnummer"),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  type: "onboarding" | "demo";
  children: React.ReactNode;
}

export const OnboardingForm = ({ type, children }: OnboardingFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      orgNumber: "",
      businessType: "",
      numberOfEmployees: "",
      contactPerson: {
        role: "",
        name: "",
        email: "",
        phone: "",
      },
    },
  });

  const businessTypes = [
    "Fastighetsmäklarfirma",
    "Mäklarkedja",
    "Franchisekontor", 
    "Enskild näringsidkare",
    "Annat"
  ];

  const employeeRanges = [
    "1-5 anställda",
    "6-15 anställda", 
    "16-50 anställda",
    "51+ anställda"
  ];

  const contactRoles = [
    "VD/Verkställande direktör",
    "Mäklarchef",
    "Kontorschef", 
    "Fastighetsmäklare",
    "IT-ansvarig",
    "Annat"
  ];

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    toast({
      title: type === "onboarding" ? "Onboarding påbörjad!" : "Demo bokad!",
      description: "Vi kommer att höra av oss inom kort.",
    });
    setIsExpanded(false);
    form.reset();
  };

  const formatOrgNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 6) {
      return `${digits.slice(0, 6)}-${digits.slice(6)}`;
    }
    return digits;
  };

  return (
    <div className="w-full">
      <div onClick={() => setIsExpanded(!isExpanded)}>
        {children}
      </div>
      
      {isExpanded && (
        <div className="mt-6 bg-background border rounded-lg p-6 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {type === "onboarding" ? "Starta onboarding" : "Boka demo"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Företagsnamn *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ange företagsnamn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orgNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisationsnummer *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="XXXXXX-XXXX" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatOrgNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verksamhetstyp *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj verksamhetstyp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antal anställda *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj antal anställda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold mb-4">Kontaktperson</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPerson.role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Välj roll" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>För- och efternamn *</FormLabel>
                        <FormControl>
                          <Input placeholder="Anna Andersson" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-postadress *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="anna@företag.se" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefonnummer *</FormLabel>
                        <FormControl>
                          <Input placeholder="070-123 45 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1"
                >
                  Stäng
                </Button>
                <Button type="submit" className="flex-1">
                  {type === "onboarding" ? "Skicka onboarding-förfrågan" : "Boka demo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};