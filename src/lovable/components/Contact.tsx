import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, Calendar } from "lucide-react";

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

export const Contact = () => {
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
      title: "Förfrågan skickad!",
      description: "Vi kommer att höra av oss inom kort.",
    });
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
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Kom igång section - HIDDEN */}
        {/* <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Kom igång
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Redo att
            <span className="text-primary"> börja?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Välj hur du vill komma igång med Velia. Vi hjälper dig genom hela processen.
          </p>
        </div> */}

        <div className="max-w-4xl mx-auto">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Kontakta oss</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <Button type="submit" className="w-full">
                        Skicka förfrågan
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
};