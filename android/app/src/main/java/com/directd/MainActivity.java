package com.directd;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "DirectD";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
//        SplashScreen.show(this, true);
        /*<item name="logo_animated" type="drawable">
        @drawable/logo_animated </item>
        <item name="imageViewLogo" type="id">
            @+id/imageViewLogo </item>*/

        /*
        final AnimatedVectorDrawableCompat animatedVector = AnimatedVectorDrawableCompat.create(activity, R.drawable.logo_animated);
        final Handler mainHandler = new Handler(Looper.getMainLooper()); // in show section

        imageViewLogo = (ImageView) mSplashDialog.findViewById(R.id.imageViewLogo); // in isShowing section
        imageViewLogo.setImageDrawable(animatedVector);

        animatedVector.registerAnimationCallback(new Animatable2Compat.AnimationCallback() {
            @Override
            public void onAnimationEnd(final Drawable drawable) {
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        animatedVector.start();
                    }
                });
            }
        });

        animatedVector.start();*/

    SplashScreen.show(this, R.style.SplashScreenTheme);

    super.onCreate(savedInstanceState);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
