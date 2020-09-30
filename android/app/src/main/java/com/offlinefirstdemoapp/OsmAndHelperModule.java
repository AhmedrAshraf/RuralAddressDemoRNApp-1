package com.offlinefirstdemoapp;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
// import android.support.annotation.NonNull;
// import android.support.annotation.Nullable;
import android.widget.Toast;

// import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OsmAndHelperModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

	private static final String PREFIX = "osmand.api://";
	private static final String OSMAND_FREE_PACKAGE_NAME = "net.osmand";
	private static final String OSMAND_PLUS_PACKAGE_NAME = "net.osmand.plus";
	private static final String OSMAND_PACKAGE_NAME = OSMAND_PLUS_PACKAGE_NAME;

	// Result codes
	// RESULT_OK == -1
	// RESULT_CANCELED == 0
	// RESULT_FIRST_USER == 1
	// from Activity
	public static final int RESULT_CODE_ERROR_UNKNOWN = 1001;
	public static final int RESULT_CODE_ERROR_NOT_IMPLEMENTED = 1002;
	public static final int RESULT_CODE_ERROR_PLUGIN_INACTIVE = 1003;
	public static final int RESULT_CODE_ERROR_GPX_NOT_FOUND = 1004;
	public static final int RESULT_CODE_ERROR_INVALID_PROFILE = 1005;
	public static final int RESULT_CODE_ERROR_EMPTY_SEARCH_QUERY = 1006;
	public static final int RESULT_CODE_ERROR_SEARCH_LOCATION_UNDEFINED = 1007;
	public static final int RESULT_CODE_ERROR_QUICK_ACTION_NOT_FOUND = 1008;

	// Information
	private static final String GET_INFO = "get_info";

	// Related to recording media
	private static final String RECORD_AUDIO = "record_audio";
	private static final String RECORD_VIDEO = "record_video";
	private static final String RECORD_PHOTO = "record_photo";
	private static final String STOP_AV_REC = "stop_av_rec";

	private static final String ADD_FAVORITE = "add_favorite";
	private static final String ADD_MAP_MARKER = "add_map_marker";

	private static final String SHOW_LOCATION = "show_location";

	private static final String SHOW_GPX = "show_gpx";
	private static final String NAVIGATE_GPX = "navigate_gpx";

	private static final String NAVIGATE = "navigate";
	private static final String NAVIGATE_SEARCH = "navigate_search";
	private static final String PAUSE_NAVIGATION = "pause_navigation";
	private static final String RESUME_NAVIGATION = "resume_navigation";
	private static final String STOP_NAVIGATION = "stop_navigation";
	private static final String MUTE_NAVIGATION = "mute_navigation";
	private static final String UNMUTE_NAVIGATION = "unmute_navigation";

	private static final String START_GPX_REC = "start_gpx_rec";
	private static final String STOP_GPX_REC = "stop_gpx_rec";
	private static final String SAVE_GPX = "save_gpx";
	private static final String CLEAR_GPX = "clear_gpx";

	public static final String API_CMD_EXECUTE_QUICK_ACTION = "execute_quick_action";
	public static final String API_CMD_GET_QUICK_ACTION_INFO = "get_quick_action_info";

	// Parameters
	public static final String API_CMD_SUBSCRIBE_VOICE_NOTIFICATIONS = "subscribe_voice_notifications";

	public static final String PARAM_NAME = "name";
	public static final String PARAM_DESC = "desc";
	public static final String PARAM_CATEGORY = "category";
	public static final String PARAM_LAT = "lat";
	public static final String PARAM_LON = "lon";
	public static final String PARAM_COLOR = "color";
	public static final String PARAM_VISIBLE = "visible";

	public static final String PARAM_PATH = "path";
	public static final String PARAM_URI = "uri";
	public static final String PARAM_DATA = "data";
	public static final String PARAM_FORCE = "force";
	public static final String PARAM_SEARCH_PARAMS = "search_params";

	public static final String PARAM_START_NAME = "start_name";
	public static final String PARAM_DEST_NAME = "dest_name";
	public static final String PARAM_START_LAT = "start_lat";
	public static final String PARAM_START_LON = "start_lon";
	public static final String PARAM_DEST_LAT = "dest_lat";
	public static final String PARAM_DEST_LON = "dest_lon";
	public static final String PARAM_DEST_SEARCH_QUERY = "dest_search_query";
	public static final String PARAM_SEARCH_LAT = "search_lat";
	public static final String PARAM_SEARCH_LON = "search_lon";
	public static final String PARAM_SHOW_SEARCH_RESULTS = "show_search_results";
	public static final String PARAM_PROFILE = "profile";

	public static final String PARAM_ETA = "eta";
	public static final String PARAM_TIME_LEFT = "time_left";
	public static final String PARAM_DISTANCE_LEFT = "time_distance_left";

	public static final String PARAM_CLOSE_AFTER_COMMAND = "close_after_command";

	public static final String PARAM_QUICK_ACTION_NAME = "quick_action_name";
	public static final String PARAM_QUICK_ACTION_TYPE = "quick_action_type";
	public static final String PARAM_QUICK_ACTION_PARAMS = "quick_action_params";
	public static final String PARAM_QUICK_ACTION_NUMBER = "quick_action_number";

	private final int mRequestCode;
	private Activity mActivity;
	//private final OnOsmandMissingListener mOsmandMissingListener;

    OsmAndHelperModule(ReactApplicationContext context) {
        super(context);
		reactContext = context;
		mActivity = getCurrentActivity();
		mRequestCode = 1;
    }

	// public OsmAndHelper(Activity activity, int requestCode, OnOsmandMissingListener listener) {
	// 	this.mRequestCode = requestCode;
	// 	mActivity = activity;
	// 	mOsmandMissingListener = listener;
    // }

    @Override
    public String getName() {
        return "OsmAnd";
    }

	/**
	 * Simply requests data about OsmAnd status.
	 * Data returned as extras. Each key value pair as separate entity.
	 */
	@ReactMethod
	public void getInfo() {
		sendRequest(new OsmAndIntentBuilder(GET_INFO));
	}

	@ReactMethod
    public void doNothing() {
        // Toast.makeText(mActivity, "OK", Toast.LENGTH_LONG).show();
    }

	/**
	 * Navigate from one location to another.
	 *
	 * @param startName - Name of starting point. Sent as URI parameter.
	 * @param startLat  - Start latitude. Sent as URI parameter.
	 * @param startLon  - Start longitude. Sent as URI parameter.
	 * @param destName  - Name of destination point. Sent as URI parameter.
	 * @param destLat   - Destination latitude. Sent as URI parameter.
	 * @param destLon   - Destination longitude. Sent as URI parameter.
	 * @param profile   - Map profile can be one of: "default", "car", "bicycle",
	 *                  "pedestrian", "aircraft", "boat", "hiking", "motorcycle", "truck".
	 *                  Sent as URI parameter.
	 * @param force     - Stop previous navigation if active. Sent as URI parameter.
	 */

    @ReactMethod
	public void navigate(String startName, double startLat, double startLon,
						 String destName, double destLat, double destLon,
						 String profile, boolean force) {

		mActivity = getCurrentActivity();
		// test navigate
		Map<String, String> params = new HashMap<>();
		params.put(PARAM_START_LAT, String.valueOf(startLat));
		params.put(PARAM_START_LON, String.valueOf(startLon));
		params.put(PARAM_START_NAME, startName);
		params.put(PARAM_DEST_LAT, String.valueOf(destLat));
		params.put(PARAM_DEST_LON, String.valueOf(destLon));
		params.put(PARAM_DEST_NAME, destName);
		params.put(PARAM_PROFILE, profile);
		params.put(PARAM_FORCE, String.valueOf(force));
		sendRequest(new OsmAndIntentBuilder(NAVIGATE).setParams(params));
	}

	/**
	 * Creates intent and executes request.
	 *
	 * @param intentBuilder - contains intent parameters.
	 */
	private void sendRequest(OsmAndIntentBuilder intentBuilder) {
		try {
		    //Toast.makeText(mActivity, "Test", Toast.LENGTH_LONG).show();

		    Uri uri = intentBuilder.getUri();
			Intent intent = new Intent(Intent.ACTION_VIEW, uri);
			intent.addFlags(intentBuilder.getFlags());
			Map<String, String> extraData = intentBuilder.getExtraData();
			if (extraData != null) {
				for (String key : extraData.keySet()) {
					intent.putExtra(key, extraData.get(key));
				}
			}
			if (intentBuilder.getGpxUri() != null) {
				ClipData clipData = ClipData.newRawUri("Gpx", intentBuilder.getGpxUri());
				intent.setClipData(clipData);
			}
			if (isIntentSafe(intent)) {
				mActivity.startActivityForResult(intent, mRequestCode);
			}
			// else {
			// 	mOsmandMissingListener.osmandMissing();
			// }
		} catch (Exception e) {
			Toast.makeText(mActivity, e.getMessage(), Toast.LENGTH_LONG).show();
		}
	}

	/**
	 * Creates intent and executes request.
	 *
	 * @param fileUri - Uri address of the file
	 */
	private void sendFileRequest(Uri fileUri) {
		try {
			Intent intent = new Intent(Intent.ACTION_VIEW, fileUri);
			if (isIntentSafe(intent)) {
				mActivity.startActivityForResult(intent, mRequestCode);
			}
			// else {
			// 	mOsmandMissingListener.osmandMissing();
			// }
		} catch (Exception e) {
			Toast.makeText(mActivity, e.getMessage(), Toast.LENGTH_LONG).show();
		}
	}

	/**
	 * Convenience method to validate if intent can be handled.
	 *
	 * @param intent - intent to be checked
	 * @return true if activity that can handle intent was found. False otherwise.
	 */
	public boolean isIntentSafe(Intent intent) {
		PackageManager packageManager = mActivity.getPackageManager();
		List activities = packageManager.queryIntentActivities(intent,
				PackageManager.MATCH_DEFAULT_ONLY);
		return activities.size() > 0;
	}

	public void executeQuickAction(int actionNumber) {
		Map<String, String> params = new HashMap<>();
		params.put(PARAM_CLOSE_AFTER_COMMAND, String.valueOf(false));
		params.put(PARAM_QUICK_ACTION_NUMBER, String.valueOf(actionNumber));
		sendRequest(new OsmAndIntentBuilder(API_CMD_EXECUTE_QUICK_ACTION).setParams(params));
	}

	public void getQuickActionInfo(int actionNumber) {
		Map<String, String> params = new HashMap<>();
		params.put(PARAM_CLOSE_AFTER_COMMAND, String.valueOf(false));
		params.put(PARAM_QUICK_ACTION_NUMBER, String.valueOf(actionNumber));
		sendRequest(new OsmAndIntentBuilder(API_CMD_GET_QUICK_ACTION_INFO).setParams(params));
	}

	public interface OnOsmandMissingListener {
		void osmandMissing();
	}

	private static class OsmAndIntentBuilder {
		final String command;
		Map<String, String> params;
		Map<String, String> extraData;
		int flags;
		Uri gpxUri;

		public OsmAndIntentBuilder(String command) {
			this.command = command;
		}

		public OsmAndIntentBuilder setExtraData(Map<String, String> extraData) {
			this.extraData = extraData;
			return this;
		}

		public OsmAndIntentBuilder setFlags(int flags) {
			this.flags = flags;
			return this;
		}

		public OsmAndIntentBuilder setGpxUri(Uri gpxUri) {
			this.gpxUri = gpxUri;
			return this;
		}

		public OsmAndIntentBuilder setParams(Map<String, String> params) {
			this.params = params;
			return this;
		}

		public Map<String, String> getParams() {
			return params;
		}

		public Uri getUri() {
			return Uri.parse(getUriString(command, params));
		}

		public Map<String, String> getExtraData() {
			return extraData;
		}

		public int getFlags() {
			return flags;
		}

		public Uri getGpxUri() {
			return gpxUri;
		}

		private static String getUriString(String command,
										   Map<String, String> parameters) {
			StringBuilder stringBuilder = new StringBuilder(PREFIX);
			stringBuilder.append(command);
			if (parameters != null && parameters.size() > 0) {
				stringBuilder.append("?");
				for (String key : parameters.keySet()) {
					stringBuilder.append(key).append("=").append(parameters.get(key)).append("&");
				}
				stringBuilder.delete(stringBuilder.length() - 1, stringBuilder.length());
			}
			return stringBuilder.toString();
		}
	}
}
