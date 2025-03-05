/*
package Frontend.android.app.src.main.java.com.rezepte_app;

import android.os.Bundle;
import android.util.Log;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;

import java.util.List;

public class BillingHelper {

  private BillingClient billingClient;

  // Initialize the BillingClient
  public void initializeBillingClient(MainActivity activity) {
    billingClient = BillingClient.newBuilder(activity)
      .setListener(new PurchasesUpdatedListener() {
        @Override
        public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
          if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            // Handle purchase
            for (Purchase purchase : purchases) {
              Log.d("Billing", "Purchase: " + purchase.getSku());
            }
          }
        }
      })
      .enablePendingPurchases()
      .build();

    connectToBillingClient();
  }

  // Connect to Google Play Billing
  private void connectToBillingClient() {
    billingClient.startConnection(new BillingClientStateListener() {
      @Override
      public void onBillingSetupFinished(BillingResult billingResult) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
          Log.d("Billing", "BillingClient connected.");
        }
      }

      @Override
      public void onBillingServiceDisconnected() {
        Log.d("Billing", "BillingClient disconnected.");
      }
    });
  }
}
*/
