import { Router } from 'express';
import Stripe from 'stripe';
import { getDb } from '../db';
import { courseEnrollments, courses, courseBundles, coupons, couponUsage } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Create payment intent or enroll for free
router.post('/enrollment/create', async (req, res) => {
  try {
    const { type, itemId, userId, couponId } = req.body;
    
    if (!type || !itemId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const db = await getDb();
    
    // Get item details
    let item: any;
    let stripePriceId: string | null;
    
    if (type === 'course') {
      [item] = await db.select().from(courses).where(eq(courses.id, itemId));
      stripePriceId = item?.stripePriceId;
    } else {
      [item] = await db.select().from(courseBundles).where(eq(courseBundles.id, itemId));
      stripePriceId = item?.stripePriceId;
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    let finalAmount = type === 'course' ? item.price : item.bundlePrice;
    let appliedCoupon: any = null;
    
    // Apply coupon if provided
    if (couponId) {
      [appliedCoupon] = await db.select().from(coupons).where(eq(coupons.id, couponId));
      
      if (appliedCoupon && appliedCoupon.active === 1) {
        if (appliedCoupon.discountType === 'percentage') {
          const discount = (finalAmount * appliedCoupon.discountValue) / 100;
          finalAmount = Math.max(0, finalAmount - discount);
        } else {
          finalAmount = Math.max(0, finalAmount - (appliedCoupon.discountValue * 100));
        }
      }
    }
    
    // If final amount is 0, enroll directly without payment
    if (finalAmount === 0) {
      const [enrollment] = await db.insert(courseEnrollments).values({
        userId,
        courseId: type === 'course' ? itemId : null,
        bundleId: type === 'bundle' ? itemId : null,
        enrollmentType: type,
        paymentStatus: 'free',
        amountPaid: 0,
        couponId: couponId || null,
      });
      
      // Record coupon usage
      if (couponId && appliedCoupon) {
        await db.insert(couponUsage).values({
          couponId,
          userId,
          orderId: enrollment.insertId,
        });
        
        await db
          .update(coupons)
          .set({ usedCount: appliedCoupon.usedCount + 1 })
          .where(eq(coupons.id, couponId));
      }
      
      return res.json({
        success: true,
        enrollmentId: enrollment.insertId,
        paymentRequired: false,
      });
    }
    
    // Create Stripe payment intent
    if (!stripePriceId) {
      return res.status(400).json({ error: 'Stripe price not configured for this item' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'gbp',
      metadata: {
        userId: userId.toString(),
        type,
        itemId: itemId.toString(),
        couponId: couponId?.toString() || '',
      },
    });
    
    // Create pending enrollment
    const [enrollment] = await db.insert(courseEnrollments).values({
      userId,
      courseId: type === 'course' ? itemId : null,
      bundleId: type === 'bundle' ? itemId : null,
      enrollmentType: type,
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      stripePriceId,
      amountPaid: 0,
      couponId: couponId || null,
    });
    
    res.json({
      success: true,
      enrollmentId: enrollment.insertId,
      paymentRequired: true,
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
    });
    
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Get user's enrollments
router.get('/enrollment/my-courses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const db = await getDb();
    
    const enrollments = await db
      .select()
      .from(courseEnrollments)
      .where(and(
        eq(courseEnrollments.userId, parseInt(userId)),
        eq(courseEnrollments.paymentStatus, 'completed')
      ));
    
    // Fetch course/bundle details for each enrollment
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (enrollment.enrollmentType === 'course' && enrollment.courseId) {
          const [course] = await db
            .select()
            .from(courses)
            .where(eq(courses.id, enrollment.courseId));
          
          return {
            ...enrollment,
            item: course,
          };
        } else if (enrollment.enrollmentType === 'bundle' && enrollment.bundleId) {
          const [bundle] = await db
            .select()
            .from(courseBundles)
            .where(eq(courseBundles.id, enrollment.bundleId));
          
          return {
            ...enrollment,
            item: bundle,
          };
        }
        
        return enrollment;
      })
    );
    
    res.json(enrichedEnrollments);
    
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

export default router;
