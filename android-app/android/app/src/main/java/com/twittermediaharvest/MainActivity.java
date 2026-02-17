package com.twittermediaharvest;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;

public class MainActivity extends ReactActivity {

    private String pendingSharedUrl = null;

    @Override
    protected String getMainComponentName() {
        return "TwitterMediaHarvest";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIncomingIntent(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type)) {
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
                if (sharedText != null) {
                    pendingSharedUrl = sharedText;
                    emitSharedUrl(sharedText);
                }
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (pendingSharedUrl != null) {
            emitSharedUrl(pendingSharedUrl);
            pendingSharedUrl = null;
        }
    }

    private void emitSharedUrl(String url) {
        try {
            ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
            if (reactContext != null) {
                WritableMap params = Arguments.createMap();
                params.putString("sharedUrl", url);
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("SharedUrl", params);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            DefaultNewArchitectureEntryPoint.getEnabled());
    }
}
