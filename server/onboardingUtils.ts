import { db } from './db';
import { users, employeeOnboarding, onboardingSteps, type User } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Structure representing the onboarding status of a user
 */
export interface OnboardingStatus {
  isOnboarded: boolean;
  requiredFields: {
    hasFirstName: boolean;
    hasLastName: boolean;
    hasEmail: boolean;
    hasPhone: boolean;
    hasEmergencyContact: boolean;
    hasAddress: boolean;
    hasBankDetails: boolean;
    hasPan: boolean;
    hasAadhaar: boolean;
  };
  stepsProgress: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
  shouldBeOnboarded: boolean;
}

/**
 * Checks a user's onboarding status and returns detailed information
 * @param userId The user ID to check
 * @returns A Promise resolving to the user's onboarding status
 */
export async function checkUserOnboardingStatus(userId: number): Promise<OnboardingStatus | null> {
  try {
    // Fetch onboarding status from the view
    const result = await db.execute(sql`
      SELECT 
        is_onboarded,
        has_first_name,
        has_last_name,
        has_email,
        has_phone,
        has_emergency_contact,
        has_address,
        has_bank_details,
        has_pan,
        has_aadhaar,
        completed_steps,
        total_steps,
        should_be_onboarded,
        onboarding_percentage
      FROM 
        user_onboarding_status
      WHERE 
        id = ${userId}
    `);
    
    const status = result[0] as {
      is_onboarded: boolean;
      has_first_name: boolean;
      has_last_name: boolean;
      has_email: boolean;
      has_phone: boolean;
      has_emergency_contact: boolean;
      has_address: boolean;
      has_bank_details: boolean;
      has_pan: boolean;
      has_aadhaar: boolean;
      completed_steps: number;
      total_steps: number;
      should_be_onboarded: boolean;
      onboarding_percentage: number;
    };
    
    if (!status) {
      return null;
    }
    
    return {
      isOnboarded: status.is_onboarded,
      requiredFields: {
        hasFirstName: status.has_first_name,
        hasLastName: status.has_last_name,
        hasEmail: status.has_email,
        hasPhone: status.has_phone,
        hasEmergencyContact: status.has_emergency_contact,
        hasAddress: status.has_address,
        hasBankDetails: status.has_bank_details,
        hasPan: status.has_pan,
        hasAadhaar: status.has_aadhaar,
      },
      stepsProgress: {
        completedSteps: status.completed_steps,
        totalSteps: status.total_steps,
        percentage: status.onboarding_percentage,
      },
      shouldBeOnboarded: status.should_be_onboarded,
    };
  } catch (error) {
    console.error('Error checking user onboarding status:', error);
    return null;
  }
}

/**
 * Updates a user's onboarding status based on their profile completeness and steps
 * @param userId The user ID to update
 * @returns A Promise resolving to the updated user or undefined if user not found
 */
export async function updateUserOnboardingStatus(userId: number): Promise<User | undefined> {
  try {
    // Check if all required fields are filled
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return undefined;
    }
    
    // Check if all steps are completed
    const totalSteps = await db.select({ count: sql<number>`count(*)` }).from(onboardingSteps);
    const totalStepsCount = totalSteps[0]?.count || 0;
    
    const completedSteps = await db
      .select({ count: sql<number>`count(*)` })
      .from(employeeOnboarding)
      .where(
        and(
          eq(employeeOnboarding.userId, userId),
          eq(employeeOnboarding.status, 'completed')
        )
      );
    const completedStepsCount = completedSteps[0]?.count || 0;
    
    // Check all required fields
    const hasRequiredFields = 
      user.firstName !== null &&
      user.lastName !== null &&
      user.email !== null &&
      user.phoneNumber !== null &&
      user.emergencyContactName !== null &&
      user.emergencyContactNumber !== null &&
      user.currentAddress !== null &&
      user.bankAccountNumber !== null &&
      user.bankName !== null &&
      user.ifscCode !== null &&
      user.panNumber !== null &&
      user.aadhaarNumber !== null;
    
    // Update onboarding status
    const isOnboarded = hasRequiredFields && completedStepsCount === totalStepsCount;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        isOnboarded: isOnboarded,
        onboardingCompletedAt: isOnboarded ? new Date() : null,
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user onboarding status:', error);
    return undefined;
  }
}

/**
 * Get onboarding completion percentage for a user
 * @param userId The user ID to check
 * @returns A number between 0 and 100 representing onboarding completion
 */
export async function getOnboardingPercentage(userId: number): Promise<number> {
  try {
    const status = await checkUserOnboardingStatus(userId);
    return status?.stepsProgress.percentage || 0;
  } catch (error) {
    console.error('Error getting onboarding percentage:', error);
    return 0;
  }
}