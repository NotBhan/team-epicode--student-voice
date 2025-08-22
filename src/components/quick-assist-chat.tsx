
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quickAssistChatbot } from '@/ai/flows/quick-assist-chatbot';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { Loader2, MessageSquare, Sparkles, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

const initialMessages: ChatMessage[] = [
    {
        role: 'assistant',
        content: "Hi there! I'm a Gemini-powered AI assistant. Ask me a question about how StudentVoice works, or describe a problem you're facing, and I can help you articulate it."
    }
]

export function QuickAssistChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  const messageValue = form.watch('message');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageValue]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    const userMessage: ChatMessage = { role: 'user', content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    try {
      const [result] = await Promise.all([
          quickAssistChatbot({ message: values.message }),
          new Promise(resolve => setTimeout(resolve, 1500)) // 1.5-second delay
      ]);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.response,
        suggestedRewrite: result.suggestedRewrite,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: 'The AI assistant is currently unavailable. Please try again later.',
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
          aria-label="Open Quick Assist Chat"
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-headline">Quick Assist AI</SheetTitle>
          <SheetDescription>
            Get instant help with FAQs or refining your problem description.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={cn('flex items-start gap-3', { 'justify-end': msg.role === 'user' })}>
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn('max-w-[80%] rounded-lg p-3 text-sm', {
                    'bg-primary text-primary-foreground': msg.role === 'user',
                    'bg-muted': msg.role === 'assistant',
                  })}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  {msg.suggestedRewrite && (
                    <div className="mt-3 rounded-md border border-accent/50 bg-accent/10 p-2">
                       <div className="flex items-center gap-2 font-semibold text-accent">
                         <Sparkles className="h-4 w-4" />
                         <span>Suggested Rewrite</span>
                       </div>
                       <p className="mt-1 text-accent/90">{msg.suggestedRewrite}</p>
                    </div>
                  )}
                </div>
                 {msg.role === 'user' && (
                  <Avatar className="h-8 w-8 bg-muted">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback>
                            <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Type your message..."
                        className="max-h-48 min-h-[40px] resize-none overflow-y-auto"
                        {...field}
                        ref={textareaRef}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
              </Button>
            </form>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
