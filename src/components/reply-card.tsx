'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, User, Crown, ShieldCheck, CornerDownLeft } from 'lucide-react';
import type { Reply } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ReplyCardProps {
  reply: Reply;
  onReply: (replyId: string) => void;
}

export function ReplyCard({ reply, onReply }: ReplyCardProps) {
  const [upvotes, setUpvotes] = useState(reply.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setIsUpvoted(!isUpvoted);
  };
  
  const isAdmin = !!reply.author.post;

  return (
    <Card className={cn("bg-background/80", { 'border-amber-200 bg-amber-50': isAdmin })}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={cn(
                  {'bg-primary text-primary-foreground': reply.author.isOP},
                  {'bg-amber-500 text-white': isAdmin}
              )}>
                {reply.author.isOP ? <Crown className="h-4 w-4"/> : (isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />)}
              </AvatarFallback>
            </Avatar>
            <div className="w-px h-full bg-border my-2"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <span className={cn("font-semibold", {'text-primary': reply.author.isOP, 'text-amber-700': isAdmin})}>
                        {reply.author.name}
                    </span>
                    {isAdmin && <Badge variant="outline" className="text-amber-700 border-amber-300">{reply.author.post}</Badge>}
                    <span className="text-muted-foreground">&bull;</span>
                    <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                </div>
                 <Button
                    variant={isUpvoted ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center gap-1 h-auto py-1 px-2"
                    onClick={handleUpvote}
                >
                    <ArrowUp className="h-4 w-4" />
                    <span className="font-semibold text-sm">{upvotes}</span>
                </Button>
            </div>
            <p className="mt-2 text-base text-foreground/90">{reply.content}</p>
            <div className="mt-2 flex items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary h-auto p-1"
                    onClick={() => onReply(reply.id)}
                >
                    <CornerDownLeft className="h-4 w-4" />
                    <span>Reply</span>
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
