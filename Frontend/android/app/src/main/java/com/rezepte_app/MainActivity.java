package com.rezepte_app;

import android.os.Bundle;
import android.util.Log;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Edge-to-Edge Design
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    // Transparent system bars
    getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
    getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);

    Log.d("MainActivity", "App initialized");
  }

  @Override
  public void onResume() {
    super.onResume();
    // Xiaomi/Huawei device workaround
    runOnUiThread(() -> {
      if (getBridge() != null) {
        getBridge().reload();
      }
    });
  }

  @Override
  public void onStart() {
    super.onStart();
    Log.d("MainActivity", "onStart called");
  }
}
