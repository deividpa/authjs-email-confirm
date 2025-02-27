"use client";

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { loginSchema } from '@/lib/zod'
import { loginAction } from '../../actions/auth-action';

type LoginFormInputs = z.infer<typeof loginSchema>

const FormLogin = () => {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: LoginFormInputs) {
    await loginAction(data)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-slate-600">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto p-10 space-y-6 rounded-xl border-2 border-slate-950">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Ingresa tu email" {...field} />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
          <FormLabel>Contraseña</FormLabel>
          <FormControl>
            <Input placeholder="Ingresa tu contraseña" type="password" {...field} />
          </FormControl>
          <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default FormLogin