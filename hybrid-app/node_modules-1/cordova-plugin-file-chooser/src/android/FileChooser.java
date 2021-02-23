package com.cesidiodibenedetto.filechooser;

import java.util.HashMap;
import java.util.Map;
import java.io.File;

import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.PluginResult;

import com.ipaulpro.afilechooser.utils.FileUtils;

/**
 * FileChooser is a PhoneGap plugin that acts as polyfill for Android KitKat and web
 * applications that need support for <input type="file">
 *
 */
public class FileChooser extends CordovaPlugin {

    private CallbackContext callbackContext = null;
    private static final String TAG = "FileChooser";
    private static final int REQUEST_CODE = 6666; // onActivityResult request code

    private void showFileChooser(String mime) {
        // Use the GET_CONTENT intent from the utility class
        Intent target = FileUtils.createGetContentIntent(mime);
        // Create the chooser Intent

        Context context = this.cordova.getActivity().getApplicationContext();
        String packageName = context.getPackageName();
        int chooserTitleStringId = context.getResources().getIdentifier("chooser_title", "string", packageName);
        Intent intent = Intent.createChooser(target, context.getResources().getString(chooserTitleStringId));

        try {
            this.cordova.startActivityForResult((CordovaPlugin) this, intent, REQUEST_CODE);
        } catch (ActivityNotFoundException e) {
            // The reason for the existence of aFileChooser
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if( requestCode == REQUEST_CODE) {
                if (resultCode == Activity.RESULT_OK) {
                    if (data != null) {
                        // Get the URI of the selected file
                        final Uri uri = data.getData();
                        Log.i(TAG, "URI: " + uri.toString());
                        JSONObject obj = new JSONObject();
                        try {
                            File f = FileUtils.getFile(this.cordova.getActivity(), uri);
                            if (f == null) {
                                this.callbackContext.error("Selected file must be on local drive");
                            } else {
                                final String url = f.toURI().toURL().toString();
                                Log.i(TAG, "URL: " + url);
                                obj.put("url", url);
                                this.callbackContext.success(obj);
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "File select error", e);
                            this.callbackContext.error(e.getMessage());
                        }
                    }
                } else {
                    this.callbackContext.error("No file selected");
                }
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
            this.callbackContext = callbackContext;
            if (action.equals("open")) {
                try {
                    JSONObject options = args.getJSONObject(0);
                    final String mime = options.optString("mime", "*/*");
                    showFileChooser(mime);
                } catch (Exception e) {
                    callbackContext.error(e.getMessage());
                }
                return true;
            }
            else {
                return false;
            }
    }

}
