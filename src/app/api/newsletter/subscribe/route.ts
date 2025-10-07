import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the schema inline to avoid import issues
const NewsletterUserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  firstName: { 
    type: String, 
    trim: true,
    maxlength: 50
  },
  lastName: { 
    type: String, 
    trim: true,
    maxlength: 50
  },
  subscribedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  source: { 
    type: String, 
    trim: true,
    maxlength: 100
  },
  ip: { 
    type: String,
    trim: true
  },
  userAgent: { 
    type: String,
    trim: true
  },
  unsubscribedAt: { 
    type: Date 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }]
}, {
  timestamps: true,
});

// Create the model
const NewsletterUser = mongoose.models.NewsletterUser || mongoose.model('NewsletterUser', NewsletterUserSchema);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, source = 'newsletter-section' } = body;

    console.log('Newsletter subscription attempt:', { email, firstName, lastName, source });

    // Simple email validation
    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'ایمیل نامعتبر است'
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    console.log('Database connected successfully');

    // Check if email already exists
    const existingSubscriber = await NewsletterUser.findOne({ 
      email: email.toLowerCase().trim()
    });

    if (existingSubscriber) {
      console.log('Existing subscriber found:', existingSubscriber.email);
      
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          {
            success: true,
            message: 'این ایمیل قبلاً در خبرنامه ثبت شده است',
            data: {
              email: existingSubscriber.email,
              subscribedAt: existingSubscriber.subscribedAt,
              isActive: existingSubscriber.isActive
            }
          },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        if (firstName) existingSubscriber.firstName = firstName.trim();
        if (lastName) existingSubscriber.lastName = lastName.trim();
        existingSubscriber.source = source;
        
        await existingSubscriber.save();

        return NextResponse.json(
          {
            success: true,
            message: 'عضویت شما در خبرنامه دوباره فعال شد',
            data: {
              email: existingSubscriber.email,
              firstName: existingSubscriber.firstName,
              lastName: existingSubscriber.lastName,
              subscribedAt: existingSubscriber.subscribedAt,
              isActive: existingSubscriber.isActive
            }
          },
          { status: 200 }
        );
      }
    }

    // Create new newsletter subscriber
    const newsletterUser = new NewsletterUser({
      email: email.toLowerCase().trim(),
      firstName: firstName ? firstName.trim() : undefined,
      lastName: lastName ? lastName.trim() : undefined,
      source,
      tags: ['newsletter', source]
    });

    await newsletterUser.save();
    console.log('New subscriber created:', newsletterUser.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'با موفقیت در خبرنامه عضو شدید',
        data: {
          email: newsletterUser.email,
          firstName: newsletterUser.firstName,
          lastName: newsletterUser.lastName,
          subscribedAt: newsletterUser.subscribedAt,
          isActive: newsletterUser.isActive
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'خطا در اعتبارسنجی اطلاعات'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'خطای سرور در عضویت خبرنامه'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'ایمیل الزامی است'
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find subscriber
    const subscriber = await NewsletterUser.findOne({ 
      email: email.toLowerCase().trim()
    });

    if (!subscriber) {
      return NextResponse.json(
        {
          success: true,
          message: 'ایمیل در خبرنامه یافت نشد',
          data: {
            isSubscribed: false
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'وضعیت عضویت دریافت شد',
        data: {
          isSubscribed: subscriber.isActive,
          email: subscriber.email,
          firstName: subscriber.firstName,
          lastName: subscriber.lastName,
          subscribedAt: subscriber.subscribedAt,
          source: subscriber.source
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter status check error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'خطای سرور در بررسی وضعیت عضویت'
      },
      { status: 500 }
    );
  }
}