"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { CREATE_MOVEMENT } from "@/utils/movements";
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
import { toast } from "@/hooks/use-toast";
import { UserSelect } from "../select/UserSelect";
import { DatePicker } from "../ui/datePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

/**
 * Validation schema for creating a movement.
 */
const formSchema = z.object({
  concept: z
    .string()
    .min(2, { message: "El concepto debe tener al menos 2 caracteres." }),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "El monto debe ser positivo." }),
  ),
  userId: z.string().min(1, { message: "Selecciona un usuario válido." }),
  date: z.date({ required_error: "Selecciona una fecha válida." }),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Selecciona el tipo de movimiento.",
  }),
});

/**
 * CreateMovementForm Component
 *
 * A form to create an income/expense movement with a user, date selection, and movement type.
 *
 * @component
 * @example
 * return (
 *   <CreateMovementForm />
 * )
 */
export default function CreateMovementForm() {
  const [createMovement] = useMutation(CREATE_MOVEMENT);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concept: "",
      amount: 0,
      userId: "",
      date: new Date(),
      type: "INCOME",
    },
  });

  /**
   * Handles form submission to create a movement.
   *
   * @param {z.infer<typeof formSchema>} formData - The form data.
   */
  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      await createMovement({
        variables: {
          input: {
            concept: formData.concept,
            amount: Number(formData.amount),
            userId: formData.userId,
            date: formData.date.toISOString(),
            type: formData.type,
          },
        },
      });

      toast({
        title: "Movimiento registrado",
        description: "El ingreso o egreso ha sido agregado exitosamente.",
      });

      form.reset();
      redirect("/transactions");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el movimiento.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <CardHeader className="text-xl font-bold mb-4">
        Registrar Movimiento
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Venta de producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej. 100"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <UserSelect value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimiento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Ingreso</SelectItem>
                      <SelectItem value="EXPENSE">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
