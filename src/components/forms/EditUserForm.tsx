"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER, UPDATE_USER } from "@/utils/users";
import { redirect, useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

/**
 * Validation schema using Zod.
 * Ensures that name and role fields have valid values.
 */
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The name must have at least 2 characters." }),
  role: z.enum(["USER", "ADMIN"], { message: "Choose a valid role." }),
});

/**
 * EditUserForm Component
 *
 * A form to edit user details using the recommended form system from shadcn.
 * It fetches user data using GraphQL, displays an interactive form, and updates user information.
 *
 * @component
 * @example
 * return (
 *   <EditUserForm />
 * )
 */
export default function EditUserForm() {
  const { id } = useParams();
  const userId = decodeURIComponent(id as string);

  // Fetch user data from GraphQL
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  // Mutation to update user information
  const [updateUser] = useMutation(UPDATE_USER);

  // React Hook Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "USER",
    },
  });

  // Update form values when data is fetched
  useEffect(() => {
    if (data?.user) {
      form.reset({
        name: data.user.name || "",
        role: data.user.role || "USER",
      });
    }
  }, [data, form]);

  /**
   * Handles form submission and updates user data in the database.
   *
   * @param {z.infer<typeof formSchema>} formData - The validated form data.
   */
  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      await updateUser({
        variables: {
          id: userId,
          input: {
            name: formData.name,
            role: formData.role,
          },
        },
      });

      toast({
        title: "User updated",
        description: "User information was successfully updated.",
      });
      redirect("/users");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update user information.",
        variant: "destructive",
      });
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <CardHeader className="text-xl font-bold mb-4">Edit User</CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
