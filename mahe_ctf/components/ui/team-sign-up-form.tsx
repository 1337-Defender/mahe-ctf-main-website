"use client"; // Required for Next.js App Router if using client-side hooks

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm, useFieldArray, FieldPath} from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button"; // Adjust path as needed
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Adjust path as needed
import { Input } from "@/components/ui/input"; // Adjust path as needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust path as needed
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path as needed
import { Separator } from "@/components/ui/separator";
import {teamSignUpAction} from "@/app/actions"; // Adjust path as needed
// import { toast } from "@/components/ui/use-toast"; // Adjust path as needed (optional for notifications)

// --- Zod Schema Definition ---

// Schema for a single member
const memberSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    registrationNumber: z
      .string()
      .min(1, { message: "Registration number is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Set the error path to confirmPassword field
  });

// Schema for the entire form
const formSchema = z.object({
  teamName: z
    .string()
    .min(2, { message: "Team name must be at least 2 characters." })
    .max(50, { message: "Team name must not exceed 50 characters." }),
  teamSize: z.string().refine((val) => ["2", "3", "4"].includes(val), {
    message: "Please select a valid team size.",
  }),
  members: z
    .array(memberSchema)
    .min(2, { message: "Team must have at least 2 members." })
    .max(4, { message: "Team can have at most 4 members." }),
});

type TeamSignUpFormValues = z.infer<typeof formSchema>;

// --- Default Member Values ---
const defaultMemberValues = {
  email: "",
  password: "",
  confirmPassword: "",
  registrationNumber: "",
};

// --- React Component ---

export default function TeamSignUpForm() {
  // State to track the selected team size for dynamically rendering fields
  const [selectedTeamSize, setSelectedTeamSize] = useState(2);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teamSize: "2", // Default team size
      members: Array.from({ length: 2 }, () => ({ ...defaultMemberValues })), // Initialize with 2 members
    },
    mode: "onChange", // Validate on change for better UX
  });

  // 2. Use useFieldArray for dynamic member fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  // 3. Watch for changes in the teamSize select field
  const watchedTeamSize = form.watch("teamSize");

  // 4. Effect to adjust the number of member fields when teamSize changes
  useEffect(() => {
    const newSize = parseInt(watchedTeamSize, 10);
    if (isNaN(newSize)) return; // Avoid issues if value is temporarily invalid

    setSelectedTeamSize(newSize); // Update local state for rendering logic if needed

    const currentSize = fields.length;

    if (newSize > currentSize) {
      // Add new member fields
      for (let i = currentSize; i < newSize; i++) {
        append({ ...defaultMemberValues });
      }
    } else if (newSize < currentSize) {
      // Remove excess member fields
      for (let i = currentSize - 1; i >= newSize; i--) {
        remove(i);
      }
    }
    // Ensure the members array in the form state matches the fields array length
    // This might be redundant if append/remove correctly update the form state,
    // but can be a safeguard.
    form.setValue(
      "members",
      form.getValues("members").slice(0, newSize),
      { shouldValidate: true } // Optionally trigger validation
    );


  }, [watchedTeamSize, append, remove, fields.length, form]);

  // 5. Define a submit handler.
  async function onSubmit(values: any) {
    // Client-side validation already passed via resolver
    console.log("Form Submitted (Client Validated):", values);

    // --- Call the Server Action with the validated data ---
    // Pass null for prevState if not using useFormState hook
    const result = await teamSignUpAction(values);

    if (result.success) {
      console.log("REGISTRATION SUCCESSFUL");
      form.reset(); // Reset form fields to default values
      // Optionally reset team size selector back to '2' if desired
      // form.setValue('teamSize', '2');
      // Maybe redirect or update UI further
    } else {
      // --- Handle Errors Returned from Server Action ---
      let generalErrorMessage = result.error || "Registration failed. Please check the form and try again."; // Fallback

      if (result.errors) {
        // Iterate through the errors object returned by the server action
        Object.entries(result.errors).forEach(([field, message]) => {
          if (field === '_general' && message) {
             // Use the specific general error message if provided
             generalErrorMessage = message;
          } else if (message) {
             // Set the error for the specific field using react-hook-form's setError
             // The field name from the server action (e.g., 'teamName', 'members.1.email')
             // must match the names used in react-hook-form.
             // Use type assertion 'as any' or provide a more specific type for field names if possible.
             form.setError(field as FieldPath<TeamSignUpFormValues>, {
               type: "server", // Indicate it's a server-side error
               message: message, // The error message from the server
             });
          }
        });
      }

      // Display the most relevant general error message
      console.error(generalErrorMessage);
    }
  }

  // --- JSX ---
  return (
    <Card className="w-full max-w-7xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Team Registration</CardTitle>
        <CardDescription>
          Register your team by providing a name and member details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your team name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a unique name for your team.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Size Selector */}
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Update form state
                      // The useEffect hook will handle adding/removing members
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">2 Members</SelectItem>
                      <SelectItem value="3">3 Members</SelectItem>
                      <SelectItem value="4">4 Members</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the number of members in your team (2-4).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            {/* Dynamic Member Fields */}
            <h3 className="text-lg font-medium mb-4">Member Details</h3>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id} // Important: use field.id from useFieldArray
                  className="p-4 border rounded-md space-y-4 bg-muted/50"
                >
                  <h4 className="font-semibold">Member {index + 1}</h4>
                  {/* Member Email */}
                  <FormField
                    control={form.control}
                    name={`members.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={`member${index + 1}@example.com`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Member Password */}
                  <FormField
                    control={form.control}
                    name={`members.${index}.password`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Member Confirm Password */}
                  <FormField
                    control={form.control}
                    name={`members.${index}.confirmPassword`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Member Registration Number */}
                  <FormField
                    control={form.control}
                    name={`members.${index}.registrationNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <CardFooter className="flex justify-end p-0 pt-8">
              <Button type="submit">Register Team</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
