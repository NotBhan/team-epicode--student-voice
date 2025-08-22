
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateHashtags } from '@/ai/flows/generate-hashtags';
import { checkMediaSource } from '@/ai/flows/check-media-source';
import { Loader2, Sparkles, X, Bot, AlertTriangle, Users, Upload, ShieldAlert, BookOpen, Building, MessageSquareQuote, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { MultiSelect } from '@/components/ui/multi-select';
import { MOCK_FACULTY } from '@/lib/mock-data';
import { useComplaints } from '@/hooks/use-complaints';
import withAuth from '@/components/auth/with-auth';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  description: z.string().min(30, 'Description must be at least 30 characters long.'),
  category: z.string().min(1, 'Please select a category.'),
  attachment: z.any().optional(),
  facultyTags: z.array(z.string()).optional(),
  revealIdentity: z.boolean().default(false),
  revealedName: z.string().optional(),
  year: z.string().optional(),
  branch: z.string().optional(),
  agreement: z.boolean().default(false),
}).refine(data => {
    if (data.revealIdentity) {
        return !!data.revealedName && data.revealedName.length > 0;
    }
    return true;
}, {
    message: 'Please enter your name.',
    path: ['revealedName'],
}).refine(data => {
    if (data.revealIdentity) {
        return data.agreement === true;
    }
    return true;
}, {
    message: 'You must agree to the terms to reveal your identity.',
    path: ['agreement'],
});

type AiCheckResult = {
  isAiGenerated: boolean;
  reason: string;
};

function ReportProblemPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingMedia, setIsCheckingMedia] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [aiCheckResult, setAiCheckResult] = useState<AiCheckResult | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { addComplaint } = useComplaints();
  const { userProfile } = useAuth();
  const [newProblemId, setNewProblemId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      facultyTags: [],
      attachment: undefined,
      revealIdentity: false,
      revealedName: '',
      year: '',
      branch: '',
      agreement: false,
    },
  });

  const { register, setValue, watch } = form;
  const attachmentRegister = register('attachment');

  const descriptionValue = watch('description');
  const revealIdentity = watch('revealIdentity');
  const agreement = watch('agreement');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAiCheckResult(null);
      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsCheckingMedia(true);
      };
      reader.onloadend = async (e) => {
        const dataUri = e.target?.result as string;
        setMediaPreview(dataUri);
        try {
          const result = await checkMediaSource({ imageDataUri: dataUri });
          setAiCheckResult(result);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error Analyzing Image',
            description: 'Could not determine if the image is AI-generated.',
          });
        } finally {
          setIsCheckingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
        setValue('attachment', null);
        setMediaPreview(null);
        setAiCheckResult(null);
    }
  };

  const handleGenerateHashtags = async () => {
    setIsGenerating(true);
    try {
      const result = await generateHashtags({ problemDescription: descriptionValue });
      setHashtags(Array.from(new Set([...hashtags, ...result.hashtags])));
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Hashtags',
        description: 'Could not generate hashtags. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const problemId = `PRB-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    const authorName = values.revealIdentity ? values.revealedName : (userProfile?.userId || 'Student');

    addComplaint({
        id: problemId,
        title: values.title,
        description: values.description,
        category: values.category,
        priorityPoints: 0,
        author: {
          name: authorName || 'Anonymous',
          ...(values.revealIdentity && {
            year: values.year,
            branch: values.branch,
          }),
        },
        status: 'Unsolved',
        hashtags: hashtags,
        createdAt: new Date().toISOString(),
    });
    
    if (values.facultyTags && values.facultyTags.length > 0) {
      toast({
        title: 'Complaint Submitted!',
        description: 'The tagged faculty members have been notified.',
      });
    }

    setNewProblemId(problemId);
    setIsDialogOpen(true);
  };

  const closeDialogAndRedirect = () => {
    setIsDialogOpen(false);
    router.push(`/`);
  }

  return (
    <>
      <div className="container mx-auto max-w-[900px] px-4 py-8 md:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Raise a Complaint</CardTitle>
            <CardDescription>
              Share a concern or problem. Your voice helps improve the campus for everyone.
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
                      <Input placeholder="e.g., Unreliable Wi-Fi in Science Building" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the issue, including location, time, and impact."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complaint Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="auto">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span>Auto-detect</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Facilities">
                          <div className="flex items-center gap-2">
                             <Building className="h-4 w-4" />
                            <span>Facilities</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Academics">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Academics</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Safety">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                           <span>Safety</span>
                          </div>
                        </SelectItem>
                         <SelectItem value="Other">
                           <div className="flex items-center gap-2">
                            <MessageSquareQuote className="h-4 w-4" />
                            <span>Other</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facultyTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tag Faculty (Optional)
                      </FormLabel>
                    <FormControl>
                      <MultiSelect
                          options={MOCK_FACULTY}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select faculty..."
                          variant="inverted"
                          animation={2}
                          maxCount={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Attach Media (Optional)</FormLabel>
                <FormControl>
                    <div>
                        <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            {...attachmentRegister}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2" />
                            Upload Image
                        </Button>
                    </div>
                </FormControl>
              </FormItem>

              {isCheckingMedia && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p>Analyzing image with AI...</p>
                  </div>
              )}
              
              {aiCheckResult && mediaPreview && (
                  <div>
                      {aiCheckResult.isAiGenerated ? (
                          <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>AI-Generated Image Detected</AlertTitle>
                              <AlertDescription>{aiCheckResult.reason} Please upload an authentic image.</AlertDescription>
                          </Alert>
                      ) : (
                          <Alert>
                              <Bot className="h-4 w-4" />
                              <AlertTitle>Image Authenticity Check</AlertTitle>
                              <AlertDescription>{aiCheckResult.reason}</AlertDescription>
                          </Alert>
                      )}
                  </div>
              )}

              {mediaPreview && (
                  <div className="relative mt-2 w-full aspect-video rounded-md overflow-hidden border">
                      <Image src={mediaPreview} alt="Media preview" layout="fill" objectFit="cover" />
                  </div>
              )}


              <div className="space-y-2">
                <FormLabel>Hashtags</FormLabel>
                <div className="rounded-md border border-input p-3 min-h-[40px]">
                  {hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button type="button" onClick={() => removeHashtag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-primary/20">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Generate hashtags for better categorization.</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isGenerating || descriptionValue?.length < 20}
                  onClick={handleGenerateHashtags}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                  )}
                  Generate with AI
                </Button>
              </div>

               <Collapsible>
                <div className="flex items-center space-x-2">
                  <FormField
                      control={form.control}
                      name="revealIdentity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                           <CollapsibleTrigger asChild>
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                           </CollapsibleTrigger>
                          <FormLabel className="cursor-pointer">Reveal My Identity (Optional)</FormLabel>
                        </FormItem>
                      )}
                    />
                </div>
                <CollapsibleContent className="mt-4 space-y-4 rounded-md border border-dashed p-4">
                   <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        By revealing your identity, your name will be publicly visible with this complaint. The platform is not responsible for any consequences of this action.
                      </AlertDescription>
                    </Alert>

                     <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!revealIdentity}/>
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal text-muted-foreground data-[disabled=true]:opacity-50">
                              I have read the warning and agree to reveal my name.
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  
                    <FormField
                      control={form.control}
                      name="revealedName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} disabled={!agreement || !revealIdentity} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                         <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2nd" {...field} disabled={!agreement || !revealIdentity} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Computer Science" {...field} disabled={!agreement || !revealIdentity} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </CollapsibleContent>
              </Collapsible>


              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.push('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={aiCheckResult?.isAiGenerated}>Submit Complaint</Button>
              </div>
            </form>
          </Form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complaint Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your complaint has been submitted. Please save your complaint ID to track its status.
              <br />
              <strong className="text-lg text-primary mt-2 block">{newProblemId}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeDialogAndRedirect}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default withAuth(ReportProblemPage, ['student'], '/login');
