import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  isOpen = false;
  userInput = '';
  showThinkingDots = true;
  showMessage = false;
  currentMessage = '';

  private messageInterval: any;
  private messageTimeout: any;
  private dotsTimeout: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  messages = [
    { text: "👋 Hi! I'm Qora from Qode Technologies.", sender: 'bot' },
    //{ text: "Click me to start chatting!", sender: 'bot' }
  ];

  randomMessages = [
    "Welcome to Qode Technologies",
    "I'm Qode' chatbot",
    "Need help with something?",
    "I'm here to assist you!",
    "Ready to chat?",
    "How can I help today?",
    "Ask me anything!"
  ];

  ngOnInit() {
    // Only start intervals in browser environment
    if (this.isBrowser) {
      this.startMessageCycle();
    }
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  startMessageCycle() {
    if (!this.isBrowser) return;

    this.messageInterval = setInterval(() => {
      this.showRandomMessage();
    }, 10000); // Every 10 seconds
  }

  showRandomMessage() {
    if (!this.isBrowser || this.isOpen) return; // Don't show messages when chat is open

    this.showThinkingDots = false;
    this.currentMessage = this.randomMessages[Math.floor(Math.random() * this.randomMessages.length)];
    this.showMessage = true;

    // Hide message after 5 seconds and show thinking dots again
    this.messageTimeout = setTimeout(() => {
      this.showMessage = false;
      this.dotsTimeout = setTimeout(() => {
        this.showThinkingDots = true;
      }, 200); // Small delay for smooth transition
    }, 5000);
  }

  toggleChat() {
    this.isOpen = true;
    // Hide any active message bubble when chat opens
    this.showMessage = false;
    this.showThinkingDots = true;
  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userText = this.userInput;
    this.messages.push({ text: userText, sender: 'user' });
    this.userInput = '';
    this.autoReply(userText);
  }

  autoReply(userText: string) {
    const msg = userText.toLowerCase();
    let response = "🤖 I'm not sure how to answer that.";

    if (msg.includes('account')) {
      response = "You can create an account here: [Link]";
    } else if (msg.includes('services')) {
      response = "We offer IT solutions, dev, and support.";
    } else if (msg.includes('help')) {
      response = "I'm here to help! What do you need assistance with?";
    } else if (msg.includes('qode')) {
      response = "Qode Technologies provides innovative IT solutions!";
    }
    else if (msg.includes('price') || msg.includes('pricing') || msg.includes('cost')) {
      response = "Our pricing varies depending on the service. You can check out our packages here: [Pricing Link]";
    } else if (msg.includes('portfolio') || msg.includes('work') || msg.includes('projects')) {
      response = "Check out some of our recent work here: [Portfolio Link]";
    }
    else if (msg.includes('contact')) {
      response = "You can reach us through our contact form here: [Contact Link] or email us directly at [Email Address]";
    } else if (msg.includes('team') || msg.includes('join') || msg.includes('career')) {
      response = "We love meeting new talent! Explore career opportunities here: [Careers Link]";
    } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      response = "Hello! 👋 How can I assist you today?";
    } else if (msg.includes('thank')) {
      response = "You're welcome! 😊 Let me know if you need anything else.";
    } else if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
      response = "Goodbye! Have a great day! 👋";
    } else if (msg.includes('location') || msg.includes('where are you')) {
      response = "We're based in Gabes, Tunisia. Find us here: [Map/Location Link]";
    }

    setTimeout(() => {
      this.messages.push({ text: response, sender: 'bot' });
    }, 500);
  }

  clearIntervals() {
    if (typeof window !== 'undefined') {
      if (this.messageInterval) clearInterval(this.messageInterval);
      if (this.messageTimeout) clearTimeout(this.messageTimeout);
      if (this.dotsTimeout) clearTimeout(this.dotsTimeout);
    }
  }
}