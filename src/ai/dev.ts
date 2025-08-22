import { config } from 'dotenv';
config();

import '@/ai/flows/quick-assist-chatbot.ts';
import '@/ai/flows/generate-hashtags.ts';
import '@/ai/flows/check-media-source.ts';
import '@/services/complaint-service.ts';
