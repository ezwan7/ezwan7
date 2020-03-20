package com.directd;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.PushNotification;

/**
 * Overrides the default PushNotification implementation to create a
 * notification with a layout similar to the 'The Big Meeting' notification,
 * showing in the screenshot above.
 */
public class MyPushNotification extends PushNotification {

    public MyPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected Notification.Builder getNotificationBuilder(PendingIntent intent) {
        final Resources resources = mContext.getResources();

        // First, get a builder initialized with defaults from the core class.
        final Notification.Builder builder = super.getNotificationBuilder(intent);

        // Set our custom overrides --

        // Enable 'extended' layout (extends on down-stroke gesture):
        final Notification.BigTextStyle extendedNotificationStyle =
                new Notification.BigTextStyle()
                        .bigText(mNotificationProps.getBody()); // "4:15 - 5:15 PM\nBig Conference Room"
        builder.setStyle(extendedNotificationStyle);

        // Set custom-action icon.
        builder.setSmallIcon(R.drawable.ic_stat_icon).setColor(resources.getColor(R.color.blue)); // Blue-ish

        /*// Add 'map' action.
        Notification.Action openMapAction = new Notification.Action(
                R.drawable.logo,
                resources.getString(R.string.action_map),
                MyIntentUtils.getMapIntent(mNotificationProps.asBundle().getString("location")));
        builder.addAction(openMapAction);

        // Add 'email guests' action.
        Notification.Action emailGuestsAction = new Notification.Action(
                R.drawable.logo_512,
                resources.getString(R.string.action_email_guests),
                MyIntentUtils.getComposeEmailIntent(mNotificationProps.asBundle().getStringArrayList("invited")));
        builder.addAction(emailGuestsAction);*/

        return builder;
    }
}
