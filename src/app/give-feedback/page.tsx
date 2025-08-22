
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  suggestion: z.string().min(20, 'Suggestion must be at least 20 characters long.'),
});

export default function GiveFeedbackPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      suggestion: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for your suggestion. We appreciate your input!',
    });
    form.reset();
    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-[900px] px-4 py-8 md:px-6 lg:px-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Give Feedback or a Suggestion</CardTitle>
          <CardDescription>
            Have an idea to improve campus life? We'd love to hear it.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., More outdoor seating" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suggestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your idea in detail. What would you like to see?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => router.push('/')}>
                Cancel
              </Button>
              <Button type="submit">Submit Feedback</Button>
            </div>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  );
}
