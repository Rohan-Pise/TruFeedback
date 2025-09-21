// utils/subscription.js
export async function checkAndUpdateSubscription(user) {
  if (!user) return null;

  const now = new Date();

  // If subscriptionEnd exists and it's in the past
  if (user.subscriptionEnd && new Date(user.subscriptionEnd) < now) {
    user.isSubscribed = false;
    await user.save(); // update in DB
  }

  return user;
}
