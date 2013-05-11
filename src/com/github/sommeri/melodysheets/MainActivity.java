package com.github.sommeri.melodysheets;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

import com.github.sommeri.melodysheets.util.SystemUiHider;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 *
 * @see SystemUiHider
 */
public class MainActivity extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        //super.loadUrl(Config.getStartUrl(), 50000);
    }

}
