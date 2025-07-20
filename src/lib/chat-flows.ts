// Standalone APK version - clean mock functions without AI dependencies

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export type ChatInput = {
  history: ChatMessage[];
};

export type InitialChatOutput = {
  response: string;
  title: string;
};

/**
 * Mock function for standalone APK - shows "connect to internet" message
 */
export async function runFinancialChatFlow(
  input: ChatInput
): Promise<InitialChatOutput> {
  return {
    response: "I need an internet connection to provide AI-powered financial insights. Please connect to the internet and try again.",
    title: "Connection Required"
  };
}

/**
 * Mock function for standalone APK - shows "connect to internet" message
 */
export async function continueFinancialChat(input: ChatInput): Promise<string> {
  return "I need an internet connection to provide AI-powered financial insights. Please connect to the internet and try again.";
}